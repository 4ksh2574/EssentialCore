package com.ax.essentialcore

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * Compact Android-native recreation of the supplied 3D liquid-glass theme switch.
 * The switch is deliberately platform-rendered with Compose; it does not depend on
 * Apple's private Liquid Glass renderer.
 */
@Composable
internal fun LiquidGlassThemeToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val progress by animateFloatAsState(
        targetValue = if (checked) 1f else 0f,
        animationSpec = spring(dampingRatio = 0.56f, stiffness = 430f),
        label = "liquid-glass-toggle-position"
    )
    val pressScale by animateFloatAsState(
        targetValue = if (pressed) 0.91f else 1f,
        animationSpec = spring(dampingRatio = 0.42f, stiffness = 650f),
        label = "liquid-glass-toggle-press"
    )
    val bulge by animateFloatAsState(
        targetValue = if (pressed) 1f else 0f,
        animationSpec = spring(dampingRatio = 0.34f, stiffness = 520f),
        label = "liquid-glass-toggle-bulge"
    )

    Canvas(
        modifier = modifier
            .size(width = 78.dp, height = 46.dp)
            .clip(RoundedCornerShape(50))
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
        val density = this
        val trackWidth = size.width * .91f
        val trackHeight = size.height * .76f
        val trackLeft = (size.width - trackWidth) / 2f
        val trackTop = (size.height - trackHeight) / 2f
        val trackRadius = CornerRadius(trackHeight / 2f)
        val trackBrush = if (checked) {
            Brush.linearGradient(
                listOf(Color(0xFF66F044), Color(0xFF28D91C), Color(0xFF50EC31)),
                start = Offset(trackLeft, trackTop),
                end = Offset(trackLeft + trackWidth, trackTop + trackHeight)
            )
        } else {
            Brush.linearGradient(
                listOf(Color(0xFFD9DADB), Color(0xFFBFC2C3), Color(0xFFD2D4D5)),
                start = Offset(trackLeft, trackTop),
                end = Offset(trackLeft + trackWidth, trackTop + trackHeight)
            )
        }
        drawRoundRect(
            brush = trackBrush,
            topLeft = Offset(trackLeft, trackTop),
            size = Size(trackWidth, trackHeight),
            cornerRadius = trackRadius
        )
        drawRoundRect(
            color = Color.White.copy(alpha = if (checked) .19f else .42f),
            topLeft = Offset(trackLeft, trackTop),
            size = Size(trackWidth, trackHeight),
            cornerRadius = trackRadius,
            style = Stroke(width = 1.dp.toPx())
        )
        drawRoundRect(
            brush = Brush.verticalGradient(
                listOf(Color.White.copy(alpha = .27f), Color.Transparent, Color.Black.copy(alpha = .035f)),
                startY = trackTop,
                endY = trackTop + trackHeight
            ),
            topLeft = Offset(trackLeft, trackTop),
            size = Size(trackWidth, trackHeight),
            cornerRadius = trackRadius,
            style = Stroke(width = 1.dp.toPx())
        )

        val thumbDiameter = size.height * .94f
        val travel = trackWidth - thumbDiameter
        val centerX = trackLeft + thumbDiameter / 2f + travel * progress
        val centerY = size.height / 2f
        val thumbWidth = thumbDiameter * (1f + .13f * bulge)
        val thumbHeight = thumbDiameter * (1f - .055f * bulge)
        val thumbLeft = centerX - thumbWidth * pressScale / 2f
        val thumbTop = centerY - thumbHeight * pressScale / 2f

        // Soft cast shadow and luminous glass body.
        drawRoundRect(
            color = Color.Black.copy(alpha = if (checked) .16f else .13f),
            topLeft = Offset(thumbLeft + 1.dp.toPx(), thumbTop + 2.dp.toPx()),
            size = Size(thumbWidth * pressScale, thumbHeight * pressScale),
            cornerRadius = CornerRadius(thumbHeight / 2f)
        )
        drawRoundRect(
            brush = Brush.radialGradient(
                colors = listOf(
                    Color.White.copy(alpha = .99f),
                    Color(0xFFF4F7F5).copy(alpha = .94f),
                    Color(0xFFDDE2DF).copy(alpha = .58f)
                ),
                center = Offset(thumbLeft + thumbWidth * .32f, thumbTop + thumbHeight * .22f),
                radius = thumbDiameter * 1.25f
            ),
            topLeft = Offset(thumbLeft, thumbTop),
            size = Size(thumbWidth * pressScale, thumbHeight * pressScale),
            cornerRadius = CornerRadius(thumbHeight * .48f)
        )
        drawRoundRect(
            color = Color.White.copy(alpha = .88f),
            topLeft = Offset(thumbLeft + 1.dp.toPx(), thumbTop + 1.dp.toPx()),
            size = Size(thumbWidth * pressScale - 2.dp.toPx(), thumbHeight * pressScale - 2.dp.toPx()),
            cornerRadius = CornerRadius(thumbHeight * .48f),
            style = Stroke(width = 1.dp.toPx())
        )
        drawRoundRect(
            brush = Brush.linearGradient(
                listOf(Color.White.copy(alpha = .62f), Color.Transparent, Color.White.copy(alpha = .18f)),
                start = Offset(thumbLeft, thumbTop),
                end = Offset(thumbLeft + thumbWidth, thumbTop + thumbHeight)
            ),
            topLeft = Offset(thumbLeft + 3.dp.toPx(), thumbTop + 3.dp.toPx()),
            size = Size(thumbWidth * pressScale - 6.dp.toPx(), thumbHeight * pressScale - 6.dp.toPx()),
            cornerRadius = CornerRadius(thumbHeight * .45f),
            style = Stroke(width = 1.dp.toPx())
        )
    }
}
