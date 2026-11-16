package com.ax.essentialcore

import androidx.compose.animation.core.animateFloatAsState

import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp

/**
 * Video-matched Liquid Glass toggle for Essential Core.
 *
 * The resting switch uses the reference's vivid lime track, soft neutral track,
 * and wide white capsule thumb. While pressed, the thumb blooms into a translucent
 * glass lens with a fine rim and curved specular highlights before it settles.
 */
@Composable
internal fun LiquidGlassThemeToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val interaction = remember { MutableInteractionSource() }
    val progress by animateFloatAsState(
        targetValue = if (checked) 1f else 0f,
        animationSpec = spring(dampingRatio = 0.62f, stiffness = 390f),
        label = "liquid-glass-toggle-position"
    )
    Canvas(
        modifier = modifier
            .size(width = 84.dp, height = 42.dp)
            .clickable(
                enabled = enabled,
                interactionSource = interaction,
                indication = null,
                role = Role.Switch,
                onClick = { onCheckedChange(!checked) }
            )
            .semantics {
                role = Role.Switch
                stateDescription = if (checked) "On" else "Off"
            }
    ) {
        val trackWidth = 70.dp.toPx()
        val trackHeight = 32.dp.toPx()
        val trackLeft = (size.width - trackWidth) / 2f
        val trackTop = (size.height - trackHeight) / 2f
        val trackSize = Size(trackWidth, trackHeight)
        val trackRadius = CornerRadius(trackHeight / 2f)

        val trackBrush = if (checked) {
            Brush.verticalGradient(
                colors = listOf(
                    Color(0xFF52F624),
                    Color(0xFF49F31F),
                    Color(0xFF43ED1B)
                ),
                startY = trackTop,
                endY = trackTop + trackHeight
            )
        } else {
            Brush.verticalGradient(
                colors = listOf(
                    Color(0xFFD0D1D2),
                    Color(0xFFC5C7C8),
                    Color(0xFFCACBCC)
                ),
                startY = trackTop,
                endY = trackTop + trackHeight
            )
        }

        // Soft ambient shadow beneath the single rounded track.
        drawRoundRect(
            color = Color.Black.copy(alpha = 0.085f),
            topLeft = Offset(trackLeft, trackTop + 2.dp.toPx()),
            size = trackSize,
            cornerRadius = trackRadius
        )
        drawRoundRect(
            brush = trackBrush,
            topLeft = Offset(trackLeft, trackTop),
            size = trackSize,
            cornerRadius = trackRadius
        )
        drawRoundRect(
            color = Color.White.copy(alpha = if (checked) 0.25f else 0.48f),
            topLeft = Offset(trackLeft, trackTop),
            size = trackSize,
            cornerRadius = trackRadius,
            style = Stroke(width = 0.8.dp.toPx())
        )

        val baseThumbWidth = 39.dp.toPx()
        val baseThumbHeight = 28.dp.toPx()
        val inset = 2.dp.toPx()
        val travel = trackWidth - baseThumbWidth - inset * 2f
        val startLeft = trackLeft + inset
        val centerX = startLeft + baseThumbWidth / 2f + travel * progress
        val centerY = size.height / 2f

        // The reference's lens briefly widens, becomes translucent, then settles.
        val thumbWidth = baseThumbWidth
        val thumbHeight = baseThumbHeight
        val thumbLeft = centerX - thumbWidth / 2f
        val thumbTop = centerY - thumbHeight / 2f
        val thumbSize = Size(thumbWidth, thumbHeight)
        val thumbRadius = CornerRadius(thumbHeight / 2f)

        drawRoundRect(
            color = Color.Black.copy(alpha = 0.105f),
            topLeft = Offset(thumbLeft + 0.6.dp.toPx(), thumbTop + 1.4.dp.toPx()),
            size = thumbSize,
            cornerRadius = thumbRadius
        )

        val tint = if (checked) Color(0xFFB9FFA9) else Color(0xFFE4E5E5)
        drawRoundRect(
            brush = Brush.radialGradient(
                colors = listOf(
                    Color.White.copy(alpha = 0.99f),
                    tint.copy(alpha = 0.06f),
                    Color.White.copy(alpha = 0.94f)
                ),
                center = Offset(thumbLeft + thumbWidth * 0.32f, thumbTop + thumbHeight * 0.2f),
                radius = thumbWidth * 1.12f
            ),
            topLeft = Offset(thumbLeft, thumbTop),
            size = thumbSize,
            cornerRadius = thumbRadius
        )

        val thumbEdge = if (checked) {
            Color(0xFF4AF222)
        } else {
            Color(0xFFD0D2D2)
        }
        drawRoundRect(
            color = thumbEdge,
            topLeft = Offset(thumbLeft, thumbTop),
            size = thumbSize,
            cornerRadius = thumbRadius,
            style = Stroke(width = 1.3.dp.toPx())
        )

    }
}
