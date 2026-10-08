import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import CourseOverview from './pages/CourseOverview'
import Courses from './pages/Courses'
import Dashboard from './pages/Dashboard'
import ModulePage from './pages/ModulePage'
import NotFound from './pages/NotFound'
import ProgressPage from './pages/ProgressPage'
import QuizPage from './pages/QuizPage'
import Results from './pages/Results'
import { AnnouncerProvider } from './state/Announcer'
import { ProgressProvider } from './state/ProgressContext'

export default function App() {
  return (
    // Respect "reduce motion" system settings: transform animations are switched off automatically.
    <MotionConfig reducedMotion="user">
      <AnnouncerProvider>
        <ProgressProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:courseId" element={<CourseOverview />} />
                <Route path="courses/:courseId/modules/:moduleId" element={<ModulePage />} />
                <Route path="courses/:courseId/quiz" element={<QuizPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="results/:courseId" element={<Results />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProgressProvider>
      </AnnouncerProvider>
    </MotionConfig>
  )
}
