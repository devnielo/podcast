import { useIsFetching } from '@tanstack/react-query'
import { Outlet, useNavigation } from 'react-router-dom'

import { AppLayout } from '@/app/layout/AppLayout'
import { Header } from '@/app/layout/Header'
import { AudioPlayer } from '@/shared/components/AudioPlayer'

export function RootLayout() {
  const navigation = useNavigation()
  const inflightQueries = useIsFetching()

  const isNavigating = navigation.state !== 'idle'
  const isFetching = inflightQueries > 0
  const showIndicator = isNavigating || isFetching

  return (
    <AppLayout
      header={<Header showIndicator={showIndicator} />}
      player={<AudioPlayer />}
    >
      <Outlet />
    </AppLayout>
  )
}
