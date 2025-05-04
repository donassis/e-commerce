import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonVariants } from "@/components/ui/button";

describe("Button Component", () => {
    // Test default rendering
    it("renders a default button", () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole("button", { name: "Click me" });

        expect(button).toBeInTheDocument();
        expect(button).toHaveClass(
            buttonVariants({ variant: "default", size: "default" })
        );
    });

    // Test variants
    it.each([
        ["default", "bg-primary text-primary-foreground"],
        ["destructive", "bg-destructive text-destructive-foreground"],
        ["outline", "border border-input bg-background"],
        ["secondary", "bg-secondary text-secondary-foreground"],
        ["ghost", "hover:bg-accent hover:text-accent-foreground"],
        ["link", "text-primary underline-offset-4"],
    ])("applies correct classes for %s variant", (variant, expectedClass) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        render(<Button variant={variant as any}>Test</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass(expectedClass);
    });

    // Test sizes
    it.each([
        ["default", "h-9 px-4 py-2"],
        ["sm", "h-8 rounded-md px-3 text-xs"],
        ["lg", "h-10 rounded-md px-8"],
        ["icon", "h-9 w-9"],
    ])("applies correct classes for %s size", (size, expectedClass) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        render(<Button size={size as any}>Test</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass(expectedClass);
    });

    // Test asChild prop
    it("renders as child when asChild is true", () => {
        render(
            <Button asChild>
                <a href="#">Link Button</a>
            </Button>
        );

        const link = screen.getByRole("link", { name: "Link Button" });
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass(
            buttonVariants({ variant: "default", size: "default" })
        );
    });

    // Test disabled state
    it("applies disabled classes when disabled", () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole("button");

        expect(button).toBeDisabled();
        expect(button).toHaveClass("disabled:pointer-events-none");
        expect(button).toHaveClass("disabled:opacity-50");
    });

    // Test className merging
    it("merges custom className with default classes", () => {
        const customClass = "custom-class";
        render(<Button className={customClass}>Test</Button>);
        const button = screen.getByRole("button");

        expect(button).toHaveClass(customClass);
        expect(button).toHaveClass(
            buttonVariants({ variant: "default", size: "default" })
        );
    });

    // Test ref forwarding
    it("forwards ref to the button element", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Test</Button>);

        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        expect(ref.current?.textContent).toBe("Test");
    });

    // Test click handler
    it("calls onClick handler when clicked", async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByRole("button");

        await user.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test focus styles
    it("applies focus-visible styles", () => {
        render(<Button>Test</Button>);
        const button = screen.getByRole("button");

        expect(button).toHaveClass("focus-visible:outline-none");
        expect(button).toHaveClass("focus-visible:ring-1");
        expect(button).toHaveClass("focus-visible:ring-ring");
    });
});