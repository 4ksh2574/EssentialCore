package com.ax.essentialcore

import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.GridView
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.TRANSPARENT
        window.navigationBarColor = android.graphics.Color.TRANSPARENT
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isNavigationBarContrastEnforced = false
            window.isStatusBarContrastEnforced = false
        }
        setContent { EssentialCoreNativeApp() }
    }
}

private enum class CoreDestination(val label: String) {
    HOME("Home"), ESSENTIAL("Essential"), PROFILE("Profile")
}

@Composable
private fun EssentialCoreNativeApp() {
    var selected by rememberSaveable { mutableStateOf(CoreDestination.HOME.name) }
    val destination = CoreDestination.valueOf(selected)

    MaterialTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF050706)
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                Box(
                    Modifier
                        .fillMaxSize()
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF111B18), Color(0xFF070A09), Color(0xFF020303))
                            )
                        )
                )
                Column(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(start = 26.dp, top = 58.dp, end = 26.dp)
                ) {
                    Text(
                        text = when (destination) {
                            CoreDestination.HOME -> "Essential Core"
                            CoreDestination.ESSENTIAL -> "Your ecosystem"
                            CoreDestination.PROFILE -> "Your profile"
                        },
                        color = Color(0xFFF2F5F2),
                        fontSize = 27.sp,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = (-1).sp
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = when (destination) {
                            CoreDestination.HOME -> "One Core. Infinite Possibilities."
                            CoreDestination.ESSENTIAL -> "Everything connected."
                            CoreDestination.PROFILE -> "Personal workspace"
                        },
                        color = Color(0xFF9BA9A1),
                        fontSize = 13.sp
                    )
                    Spacer(Modifier.height(34.dp))
                    Box(
                        Modifier
                            .size(112.dp)
                            .clip(RoundedCornerShape(32.dp))
                            .background(
                                Brush.linearGradient(
                                    listOf(Color(0xFF183B31), Color(0xFF101B17))
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("e", color = Color(0xFF9CE3CA), fontSize = 64.sp, fontWeight = FontWeight.Light)
                    }
                }

                LiquidDropNavigation(
                    selected = destination,
                    onSelect = { selected = it.name },
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 30.dp)
                )
            }
        }
    }
}

@Composable
private fun LiquidDropNavigation(
    selected: CoreDestination,
    onSelect: (CoreDestination) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        LiquidNavItem(CoreDestination.HOME, Icons.Rounded.Home),
        LiquidNavItem(CoreDestination.ESSENTIAL, Icons.Rounded.GridView),
        LiquidNavItem(CoreDestination.PROFILE, Icons.Rounded.Person)
    )
    Row(
        modifier = modifier
            .padding(horizontal = 28.dp)
            .height(54.dp)
            .clip(RoundedCornerShape(50))
            .background(Color(0xF2050606))
            .padding(5.dp),
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        items.forEach { item ->
            LiquidDropNavigationItem(
                item = item,
                selected = item.destination == selected,
                onClick = { onSelect(item.destination) },
                modifier = Modifier.weight(1f)
            )
        }
    }
}
