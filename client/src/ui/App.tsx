import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LandingPage from "./pages/Frontpage/ChoosePage.tsx";
import {Toaster} from "react-hot-toast";
import SignInPage from "./pages/Frontpage/SignInPage/SignInPage.tsx";
import SignUpPage from "./pages/Frontpage/SignUpPage/SignUpPage.tsx";
import DisplayFormattedDeviceConnection from "./pages/Frontpage/DisplayFormattedDeviceConnection.tsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.tsx";
import LobbyPage from "./pages/LobbyPage/LobbyPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import LinkDevice from "./pages/LinkDevicePage/LinkDevice.tsx";
import MainPage from "./pages/MainPage/MainPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
      <>
          <header><title>Turbine Lars</title></header>

          <RouterProvider
              router={createBrowserRouter([
                  {
                      path: "/",
                      element: <Outlet />,
                      children: [
                          {
                              path: "/",
                              element: <LandingPage/>,
                          },
                          {
                              path: "/signin",
                              element: <SignInPage/>,
                          },
                          {
                              path: "/signup",
                              element: <SignUpPage/>
                          },
                          {
                              path: "/linkdevice",
                              element: <ProtectedRoute><LinkDevice/></ProtectedRoute>
                          },
                          {
                              path: "/main",
                              element: <ProtectedRoute><MainPage/></ProtectedRoute>
                          },
                          {
                              path: "/temp",
                              element: <ProtectedRoute><DisplayFormattedDeviceConnection/></ProtectedRoute>
                          },
                          {
                            path: "/categories",
                            element: <ProtectedRoute><CategoryPage/></ProtectedRoute>
                          },
                        {
                              path: "/lobby",
                              element: <ProtectedRoute><LobbyPage/></ProtectedRoute>
                          },
                          {
                              path: "/quiz",
                              element: <ProtectedRoute><QuizPage/></ProtectedRoute>
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
