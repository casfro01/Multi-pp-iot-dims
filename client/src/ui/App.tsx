import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LandingPage from "./pages/Frontpage/ChoosePage.tsx";
import {Toaster} from "react-hot-toast";
import SignInPage from "./pages/Frontpage/SignInPage/SignInPage.tsx";
import SignUpPage from "./pages/Frontpage/SignUpPage/SignUpPage.tsx";

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
                              element: <SignInPage></SignInPage>,
                          },
                          {
                              path: "/signup",
                              element: <SignUpPage></SignUpPage>
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
