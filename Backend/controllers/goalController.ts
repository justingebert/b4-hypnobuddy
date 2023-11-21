export const test = (req, res, next) => {
    res.json({
        success: true,
        message: 'Success',
        redirect: '/',
    });
}