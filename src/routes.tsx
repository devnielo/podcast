import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage, PodcastDetailPage, EpisodeDetailPage } from '@pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/podcast/:podcastId',
    element: <PodcastDetailPage />,
  },
  {
    path: '/podcast/:podcastId/episode/:episodeId',
    element: <EpisodeDetailPage />,
  },
])

export const Routes = () => <RouterProvider router={router} />
