package com.ax.essentialcore

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp

/**
 * Two-part toggle: 1 inflates to meet the boundaries of 2, glides across,
 * then returns to its normal capsule size. The shape stays fully rounded.
 */
@Composable
internal fun LiquidGlassThemeToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val interaction = remember { MutableInteractionSource() }
    val position = remember { Animatable(if (checked) 1f else 0f) }
    val scaleX = remember { Animatable(1f) }
    val scaleY = remember { Animatable(1f) }

    LaunchedEffect(checked) {
        val destination = if (checked) 1f else 0f
        scaleX.animateTo(1.78f, spring(dampingRatio = 0.82f, stiffness = 520f))
        scaleY.animateTo(1.14f, spring(dampingRatio = 0.82f, stiffness = 520f))
        position.animateTo(destination, spring(dampingRatio = 0.86f, stiffness = 340f))
        scaleX.animateTo(1f, spring(dampingRatio = 0.82f, stiffness = 520f))
        scaleY.animateTo(1f, spring(dampingRatio = 0.82f, stiffness = 520f))
    }

    Canvas(
        modifier = modifier
            .size(width = 78.dp, height = 38.dp)
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
        val trackWidth = 64.dp.toPx()
        val trackHeight = 29.dp.toPx()
        val trackLeft = (size.width - trackWidth) / 2f
        val trackTop = (size.height - trackHeight) / 2f
        val trackSize = Size(trackWidth, trackHeight)
        val trackRadius = CornerRadius(trackHeight / 2f)
        val trackBrush = if (checked) {
            Brush.horizontalGradient(
                listOf(Color(0xFF35ED16), Color(0xFF39F51B), Color(0xFF43EF24)),
                startX = trackLeft,
                endX = trackLeft + trackWidth
            )
        } else {
            Brush.horizontalGradient(
                listOf(Color(0xFFD0D1D2), Color(0xFFC6C8C9)),
                startX = trackLeft,
                endX = trackLeft + trackWidth
            )
        }

        drawRoundRect(
            color = Color.Black.copy(alpha = 0.075f),
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

        val thumbWidth = trackWidth * 0.557f
        val thumbHeight = trackHeight * 0.875f
        val inset = 1.8.dp.toPx()
        val travel = trackWidth - thumbWidth - inset * 2f
        val thumbLeft = trackLeft + inset + travel * position.value
        val scaledWidth = thumbWidth * scaleX.value
        val scaledHeight = thumbHeight * scaleY.value
        val thumbTop = trackTop + (trackHeight - scaledHeight) / 2f
        val thumbRadius = CornerRadius(scaledHeight / 2f)

        clipRect(trackLeft, trackTop, trackLeft + trackWidth, trackTop + trackHeight) {
            drawRoundRect(
                color = Color.White.copy(alpha = 0.98f),
                topLeft = Offset(thumbLeft, thumbTop),
                size = Size(scaledWidth, scaledHeight),
                cornerRadius = thumbRadius
            )
            drawRoundRect(
                color = Color.White.copy(alpha = 0.9f),
                topLeft = Offset(thumbLeft, thumbTop),
                size = Size(scaledWidth, scaledHeight),
                cornerRadius = thumbRadius,
                style = Stroke(width = 0.45.dp.toPx())
            )
        }
    }
}
