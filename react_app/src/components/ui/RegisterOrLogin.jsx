import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cardStyle } from "../../assets/styleObjects";
import { Link } from "react-router-dom";

export const RegisterOrLogin = () => {
    return (
        <Card className="w-[500px]" style={cardStyle}>
            <CardHeader>
                <CardTitle style={{ textAlign: "center", fontSize: "2rem", marginBottom: "10px" }}>Welcome!</CardTitle>
            </CardHeader>
            <Link to="/register">
                <Button style={{width: "300px", marginBottom: "20px"}}>Register</Button>
            </Link>
            <Link to="/login">
                <Button style={{width: "300px", marginBottom: "20px"}}>Login</Button>
            </Link>
        </Card>
    );
}
