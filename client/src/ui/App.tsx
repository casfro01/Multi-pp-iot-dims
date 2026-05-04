import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import LandingPage from "./pages/Frontpage/ChoosePage.tsx";
import {Toaster} from "react-hot-toast";
import SignInPage from "./pages/Frontpage/SignInPage.tsx";
import SignUpPage from "./pages/Frontpage/SignUpPage.tsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.tsx";
import LobbyPage from "./pages/LobbyPage/LobbyPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import QuestionResultPage from "./pages/QuestionResultPage/QuestionResultPage.tsx";
import FinalResultPage from "./pages/FinalResultPage/FinalResultPage.tsx";

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
                          {
                              path: "/categories",
                              element: <CategoryPage/>,
                          },
                          {
                              path: "/lobby/:sessionId",
                              element: <LobbyPage/>,
                          },
                          {
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
