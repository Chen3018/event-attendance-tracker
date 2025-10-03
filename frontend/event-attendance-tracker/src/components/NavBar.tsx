import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

import { Link } from "react-router-dom"

export function NavBar() {
    return (
        <div className="flex justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to="/">
                                <img src="/sn.png" alt="logo" className="h-8" />
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to="/events">Events</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to="/list">List</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to="/check-in">Check-In</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to="/enter">Enter</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to="/exit">Exit</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>


            <div className="flex space-x-4">
                <Button variant="secondary">
                    <Link to="/login">Login</Link>
                </Button>
                <Button>
                    <Link to="/sign-up">Sign Up</Link>
                </Button>
            </div>
        </div>
    )
}