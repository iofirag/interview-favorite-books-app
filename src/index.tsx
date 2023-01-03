import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";
import BooksPage, { loader as booksLoader } from "./routes/BooksPage";
import ErrorPage from "./routes/ErrorPage";
import LoginPage from "./routes/Login";
import Root from "./routes/Root";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
            {
                path: "/app",
                element: <BooksPage />,
                loader: booksLoader
            }
        ],
    }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);