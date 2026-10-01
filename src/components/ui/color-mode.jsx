'use client'

import { Button, ClientOnly, Skeleton, Span } from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'

import * as React from 'react'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'

export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange {...props} />
  )
}

export function useColorMode() {
  const { theme, resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const selectedMode = forcedTheme || theme || 'system'
  const cycleColorMode = () => {
    const modes = ['system', 'light', 'dark']
    setTheme(modes[(modes.indexOf(selectedMode) + 1) % modes.length])
  }
  return {
    colorMode,
    selectedMode,
    setColorMode: setTheme,
    cycleColorMode,
  }
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon() {
  const { selectedMode } = useColorMode()
  if (selectedMode === 'system') return <LuMonitor />
  return selectedMode === 'dark' ? <LuMoon /> : <LuSun />
}

export const ColorModeButton = React.forwardRef(
  function ColorModeButton(props, ref) {
    const { selectedMode, cycleColorMode } = useColorMode()
    const label = selectedMode === 'system' ? 'Device' : selectedMode[0].toUpperCase() + selectedMode.slice(1)
    return (
      <ClientOnly fallback={<Skeleton width='28' height='10' />}>
        <Button
          onClick={cycleColorMode}
          variant='outline'
          aria-label={`Color mode: ${label}. Activate to switch mode.`}
          size='sm'
          minH='12'
          title='Switch between Device, Light, and Dark mode'
          ref={ref}
          {...props}
        >
          <ColorModeIcon />
          {label}
        </Button>
      </ClientOnly>
    )
  },
)

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme light'
      colorPalette='gray'
      colorScheme='light'
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme dark'
      colorPalette='gray'
      colorScheme='dark'
      ref={ref}
      {...props}
    />
  )
})
