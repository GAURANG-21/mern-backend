// export const ErrorMiddleWare = (err, req, res, next)=>{
//     err.stausCode = err.statusCode || 500;
//     err.message = err.message || "Internal Server Error"

//     res.status(err.statusCode).json({
//         success: false,
//         message: err.message
//     })
// }