import { useEffect, useRef } from "react";

/**
 * WebGL2 optical layer for the persistent navigation lens.
 * The surrounding DOM remains responsible for layout and navigation.
 */
export default function LiquidLens() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "low-power"
    });
    if (!gl) return;

    const vertexSource = `#version 300 es
      precision highp float;
      const vec2 POS[3] = vec2[3](
        vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0)
      );
      void main() { gl_Position = vec4(POS[gl_VertexID], 0.0, 1.0); }
    `;

    const fragmentSource = `#version 300 es
      precision highp float;
      out vec4 outColor;
      uniform vec2 u_resolution;
      uniform float u_time;

      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + vec2(r);
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }

      void main() {
        vec2 size = u_resolution;
        vec2 p = gl_FragCoord.xy - size * 0.5;
        float radius = min(size.y * 0.43, size.x * 0.32);
        float d = roundedBox(p, size * 0.5 - vec2(1.2), radius);
        float aa = max(fwidth(d), 0.8);
        float mask = 1.0 - smoothstep(-aa, aa, d);

        vec2 uv = gl_FragCoord.xy / size;
        float edge = 1.0 - smoothstep(0.02, 0.48, abs(uv.y - 0.5));
        float topGlint = exp(-pow((uv.y - 0.91) * 17.0, 2.0));
        float bottomGlint = exp(-pow((uv.y - 0.08) * 19.0, 2.0));
        float leftCaustic = exp(-pow((uv.x - 0.08) * 20.0, 2.0));
        float rightCaustic = exp(-pow((uv.x - 0.92) * 20.0, 2.0));
        float shimmer = 0.5 + 0.5 * sin(uv.x * 8.0 - u_time * 0.55);
        float movingLight = exp(-pow((uv.x - (0.28 + 0.06 * sin(u_time * 0.32))) * 5.0, 2.0));

        vec3 tint = vec3(0.68, 0.82, 0.91);
        float rim = (topGlint * 0.30 + bottomGlint * 0.20
                    + leftCaustic * 0.10 + rightCaustic * 0.10);
        float sheen = movingLight * edge * 0.055 + shimmer * 0.012;
        float alpha = mask * clamp(rim + sheen, 0.0, 0.42);
        outColor = vec4(tint, alpha);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let start = performance.now();
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width * ratio));
      height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.useProgram(program);
      gl.uniform2f(resolution, width, height);
      draw();
    };

    const draw = () => {
      if (!gl || !program) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(time, reducedMotion ? 0 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const animate = () => {
      draw();
      if (!reducedMotion) frame = requestAnimationFrame(animate);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    if (!reducedMotion) frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className="liquid-lens-shader" aria-hidden="true" />;
}
