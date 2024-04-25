import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <main className="content">
                <Outlet />
            </main>
        </>
    )
}

export default Layout;