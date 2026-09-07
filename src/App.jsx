import { RouterProvider } from "react-router-dom";
import router from "./Route/Root";

function App() {
    return <RouterProvider router={router} />;
}

export default App;