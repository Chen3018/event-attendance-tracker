import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

import { useAuth } from "@/context/AuthContext"

import { Link } from "react-router-dom"

export function NavBar() {
    const { isAuthenticated, profile, logout } = useAuth();

    return (
        <div className="flex justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/">
                                <img src="/sn.png" alt="logo" className="h-8" />
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/events">Events</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/list">List</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/check-in">Check-In</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/enter">Enter</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/exit">Exit</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {isAuthenticated ?
                <div className="flex items-center space-x-4">
                    <span>Welcome, {profile?.name}</span>
                    <Button variant="destructive" className="cursor-pointer" onClick={logout}>Logout</Button>
                </div> 
            :
                <div className="flex space-x-4">
                    <Button variant="secondary" asChild>
                        <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/sign-up">Sign Up</Link>
                    </Button>
                </div>
            }
        </div>
    )
}