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
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp

/**
 * Two-part reference toggle: 1 is the fixed white capsule, 2 is the outer
 * green capsule. The white capsule only slides; its shape never morphs.
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
        animationSpec = spring(dampingRatio = 0.82f, stiffness = 420f),
        label = "reference-toggle-position"
    )

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

        // Soft diffuse shadow and the single continuous outer capsule (2).
        drawRoundRect(
            color = Color.Black.copy(alpha = 0.075f),
            topLeft = Offset(trackLeft, trackTop + 2.dp.toPx()),
            size = trackSize,
            cornerRadius = trackRadius
        )
        if (checked) {
            drawRoundRect(
                color = Color(0xFF39F21A).copy(alpha = 0.15f),
                topLeft = Offset(trackLeft - 2.dp.toPx(), trackTop - 2.dp.toPx()),
                size = Size(trackWidth + 4.dp.toPx(), trackHeight + 4.dp.toPx()),
                cornerRadius = CornerRadius((trackHeight + 4.dp.toPx()) / 2f)
            )
        }
        drawRoundRect(
            brush = trackBrush,
            topLeft = Offset(trackLeft, trackTop),
            size = trackSize,
            cornerRadius = trackRadius
        )

        // Fixed white capsule (1): constant width, height and corner radius.
        val thumbWidth = trackWidth * 0.557f
        val thumbHeight = trackHeight * 0.875f
        val inset = 1.8.dp.toPx()
        val travel = trackWidth - thumbWidth - inset * 2f
        val thumbLeft = trackLeft + inset + travel * progress
        val thumbTop = trackTop + (trackHeight - thumbHeight) / 2f
        val thumbSize = Size(thumbWidth, thumbHeight)
        val thumbRadius = CornerRadius(thumbHeight / 2f)

        drawRoundRect(
            color = Color.White.copy(alpha = 0.98f),
            topLeft = Offset(thumbLeft, thumbTop),
            size = thumbSize,
            cornerRadius = thumbRadius
        )
        drawRoundRect(
            color = Color.White.copy(alpha = 0.9f),
            topLeft = Offset(thumbLeft, thumbTop),
            size = thumbSize,
            cornerRadius = thumbRadius,
            style = Stroke(width = 0.45.dp.toPx())
        )
    }
}
