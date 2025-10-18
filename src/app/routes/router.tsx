import { createBrowserRouter } from 'react-router-dom'
import { EpisodeDetailPage } from '@/pages/episode'
import { HomePage } from '@/pages/home'
import { PodcastDetailPage } from '@/pages/podcast'
import { RootLayout } from '@/app/routes/RootLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'podcast/:podcastId',
        element: <PodcastDetailPage />,
      },
      {
        path: 'podcast/:podcastId/episode/:episodeId',
        element: <EpisodeDetailPage />,
      },
    ],
  },
])
