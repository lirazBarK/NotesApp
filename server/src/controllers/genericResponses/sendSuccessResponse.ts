
export const sendSuccessResponse = (data, res) => {
    const body = {success: true, ...data};
    res.status(200).json(body).send();
}