import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LandingPage from "./pages/Frontpage/ChoosePage.tsx";
import {Toaster} from "react-hot-toast";
import SignInPage from "./pages/Frontpage/SignInPage/SignInPage.tsx";
import SignUpPage from "./pages/Frontpage/SignUpPage/SignUpPage.tsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.tsx";
import LobbyPage from "./pages/LobbyPage/LobbyPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import LinkDevice from "./pages/LinkDevicePage/LinkDevice.tsx";
import MainPage from "./pages/MainPage/MainPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {categories, linkdevice, lobby, main, quiz, scores, signin, signup, start} from "./pages/pages.ts";
import ScoresPage from "./pages/ScorePage/ScorePage.tsx";

function App() {
  return (
      <>
          <header><title>Turbine Lars</title></header>

          <RouterProvider
              router={createBrowserRouter([
                  {
                      path: start,
                      element: <Outlet />,
                      children: [
                          {
                              path: start,
                              element: <LandingPage/>,
                          },
                          {
                              path: signin,
                              element: <SignInPage/>,
                          },
                          {
                              path: signup,
                              element: <SignUpPage/>
                          },
                          {
                              path: linkdevice,
                              element: <ProtectedRoute><LinkDevice/></ProtectedRoute>
                          },
                          {
                              path: main,
                              element: <ProtectedRoute><MainPage/></ProtectedRoute>
                          },
                          {
                            path: categories,
                            element: <ProtectedRoute><CategoryPage/></ProtectedRoute>
                          },
                        {
                              path: lobby,
                              element: <ProtectedRoute><LobbyPage/></ProtectedRoute>
                          },
                          {
                              path: quiz,
                              element: <ProtectedRoute><QuizPage/></ProtectedRoute>
                          },
                          {
                              path: scores,
                              element: <ScoresPage/>
                          },
                      ],
                  },
              ])}
          />
          <Toaster position="top-center" reverseOrder={false}/>
      </>
  )
}

export default App
