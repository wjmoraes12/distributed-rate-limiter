import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("==================================");
    console.log(" Distributed Rate Limiter");
    console.log("==================================");
    console.log(`🚀 Server running on port ${PORT}`);
});