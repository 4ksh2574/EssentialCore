package com.ax.essentialcore

import android.graphics.RuntimeShader
import android.os.Build
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.GridView
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

internal data class LiquidNavItem(
    val destination: CoreDestination,
    val icon: ImageVector
)

@Composable
internal fun LiquidDropNavigationItem(
    item: LiquidNavItem,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .height(44.dp)
            .clip(RoundedCornerShape(50))
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = item.destination.label,
                tint = if (selected) Color.Transparent else Color(0xFF777F7B),
                modifier = Modifier.size(18.dp)
            )
            if (selected) {
                Text(
                    text = item.destination.label,
                    color = Color.Transparent,
                    fontSize = 8.sp
                )
            }
        }
    }
}

@Composable
internal fun LiquidDropNavigation(
    selected: CoreDestination,
    onSelect: (CoreDestination) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val shader = remember {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val source = context.resources.openRawResource(R.raw.liquid_drop)
                .bufferedReader().use { it.readText() }
            RuntimeShader(source)
        } else null
    }
    val selectedIndex = when (selected) {
        CoreDestination.HOME -> 0
        CoreDestination.ESSENTIAL -> 1
        CoreDestination.PROFILE -> 2
    }

    BoxWithConstraints(
        modifier = modifier
            .width(292.dp)
            .height(58.dp)
            .background(Color(0xF2050606), RoundedCornerShape(50))
            .padding(horizontal = 5.dp, vertical = 5.dp)
    ) {
        val itemWidth = maxWidth / 3
        val indicatorOffset: Dp by animateDpAsState(
            targetValue = itemWidth * selectedIndex,
            animationSpec = spring(dampingRatio = 0.58f, stiffness = 280f),
            label = "liquid-drop-position"
        )

        GlassDropLens(
            width = itemWidth,
            modifier = Modifier
                .offset(x = indicatorOffset)
                .align(Alignment.CenterStart),
            shader = shader
        )

        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            listOf(
                LiquidNavItem(CoreDestination.HOME, Icons.Rounded.Home),
                LiquidNavItem(CoreDestination.ESSENTIAL, Icons.Rounded.GridView),
                LiquidNavItem(CoreDestination.PROFILE, Icons.Rounded.Person)
            ).forEach { item ->
                val active = item.destination == selected
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxSize()
                        .clip(RoundedCornerShape(50))
                        .clickable { onSelect(item.destination) },
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.destination.label,
                            tint = if (active) Color.White else Color(0xFF777F7B),
                            modifier = Modifier.size(if (active) 18.dp else 17.dp)
                        )
                        if (active) {
                            Text(
                                text = item.destination.label,
                                color = Color.White,
                                fontSize = 8.sp,
                                lineHeight = 9.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun GlassDropLens(
    width: Dp,
    modifier: Modifier,
    shader: RuntimeShader?
) {
    val effect = remember(shader) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && shader != null) {
            android.graphics.RenderEffect
                .createRuntimeShaderEffect(shader, "content")
                .asComposeRenderEffect()
        } else null
    }

    Canvas(
        modifier = modifier
            .width(width)
            .height(72.dp)
            .graphicsLayer {
                if (effect != null) renderEffect = effect
                shadowElevation = 13.dp.toPx()
                shape = RoundedCornerShape(27.dp)
                clip = true
            }
    ) {
        shader?.setFloatUniform("resolution", size.width, size.height)
        shader?.setFloatUniform("lensCenter", size.width / 2f, size.height / 2f)
        shader?.setFloatUniform("lensRadius", size.width * .48f, size.height * .49f)

        drawRoundRect(
            brush = Brush.linearGradient(
                colors = listOf(
                    Color(0xFF52645E).copy(alpha = .72f),
                    Color(0xFF17201D).copy(alpha = .94f),
                    Color(0xFF080B0A).copy(alpha = .97f)
                ),
                start = androidx.compose.ui.geometry.Offset(0f, 0f),
                end = androidx.compose.ui.geometry.Offset(size.width, size.height)
            ),
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(size.height * .42f)
        )
        drawRoundRect(
            color = Color.White.copy(alpha = .42f),
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(size.height * .42f),
            style = Stroke(width = 1.dp.toPx())
        )
        drawRoundRect(
            brush = Brush.verticalGradient(
                listOf(Color.White.copy(alpha = .28f), Color.Transparent, Color.White.copy(alpha = .10f))
            ),
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(size.height * .42f),
            style = Stroke(width = 1.4.dp.toPx())
        )
    }
}
