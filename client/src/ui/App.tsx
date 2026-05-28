import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LandingPage from "./pages/Frontpage/ChoosePage.tsx";
import {Toaster} from "react-hot-toast";
import SignInPage from "./pages/Frontpage/SignInPage/SignInPage.tsx";
import SignUpPage from "./pages/Frontpage/SignUpPage/SignUpPage.tsx";
import DisplayFormattedDeviceConnection from "./pages/Frontpage/DisplayFormattedDeviceConnection.tsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.tsx";
import LobbyPage from "./pages/LobbyPage/LobbyPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";

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
                              path: "/temp",
                              element: <DisplayFormattedDeviceConnection/>
                          },
                          {
                            path: "/categories",
                            element: <CategoryPage/>
                          },
                        {
                              path: "/lobby",
                              element: <LobbyPage/>,
                          },
                          {
                              path: "/quiz",
                              element: <QuizPage/>,
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
