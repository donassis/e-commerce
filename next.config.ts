import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_APP_NAME: "BestFind",
        NEXT_PUBLIC_APP_SLOGAN: "Spend Less, Enjoy More.",
        NEXT_PUBLIC_APP_DESCRIPTION: "E-commerce Project",

        AUTH_SECRET: "xMm2dYEi8WZ3//0KU5FqZHGroFTxtUFqAtEghCMHZ5M=",

        MONGODB_URI: "mongodb+srv://best-find:Ona_mongodb1@cluster0.nzocn.mongodb.net/best-find?retryWrites=true&w=majority&appName=Cluster0",

        RESEND_API_KEY: "re_PPPqbiZz_HQKVAuvmf9XBmoDkCstUcyqB",
        SENDER_EMAIL: "onboarding@resend.dev",
        SENDER_NAME: "Best-Find",

        PAYPAL_API_URL: "",
        PAYPAL_CLIENT_ID: "",
        PAYPAL_APP_SECRET: "",

        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_51R9vozGh2Km4sPcqD9oAP9qiXJ4ehes3BU5yFgZ8qfCeCm295dQruNjH4Ido7kJXltjyG11059eGPSyOqx6SEZNT00i73SGASQ",
        STRIPE_SECRET_KEY: "sk_test_51R9vozGh2Km4sPcquocO0CgxsvmmlzcnmMzX7zEFrFuUbwdttNbEcnRVvE0186HVBBIWo9MExuvqKG7F7V74GIVN00IrWMVrKK",
        STRIPE_WEBHOOK_SECRET: "whsec_7CEkYOEyVoVZzWzjaI6MnFEXe2j9VfQZ"
    },
};

export default nextConfig;