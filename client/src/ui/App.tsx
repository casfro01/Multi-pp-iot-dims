import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LandingPage from "./pages/Frontpage/ChoosePage.tsx";
import {Toaster} from "react-hot-toast";
import SignInPage from "./pages/Frontpage/SignInPage/SignInPage.tsx";
import SignUpPage from "./pages/Frontpage/SignUpPage/SignUpPage.tsx";
import DisplayFormattedDeviceConnection from "./pages/Frontpage/DisplayFormattedDeviceConnection.tsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.tsx";
import LobbyPage from "./pages/LobbyPage/LobbyPage.tsx";
import LinkDevice from "./pages/LinkDevicePage/LinkDevice.tsx";
import MainPage from "./pages/MainPage/MainPage.tsx";

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
                              element: <LinkDevice/>
                          },
                          {
                              path: "/main",
                              element: <MainPage/>
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
                          /*{
                              path: "/quiz/:sessionId",
                              element: <QuizPage/>,
                          },
                          {
                              path: "/quiz/:sessionId/result",
                              element: <QuestionResultPage/>,
                          },
                          {
                              path: "/quiz/:sessionId/final",
                              element: <FinalResultPage/>,
                          },*/
                      ],
                  },
              ])}
          />
          <Toaster position="top-center" reverseOrder={false}/>
      </>
  )
}

export default App
