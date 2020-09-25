const User = require('../model/user');

class Users {
    getProfile(req, res) {
        try {
            let email = req.query.auth.email;
            const projection = {
                name: 1,
                email: 1,
                birthDate: 1,
                imgUrl: 1,
            };
            User.findOne({
                        email: email,
                    },
                    projection
                )
                .then((result) => {
                    if (!result) {
                        return res.status(400).send({
                            status: 400,
                            message: 'Invalid User',
                        });
                    }
                    result = result.toObject()
                    let bDate = new Date(result.birthDate);
                    let bMonth = bDate.getMonth();
                    let bDay = bDate.getDate();
                    let cDate = new Date();

                    const bmas = new Date(cDate.getFullYear(), bMonth, bDay);
                    if (cDate.getMonth() == bMonth && cDate.getDate() > bDay) {
                        bmas.setFullYear(bmas.getFullYear() + 1);
                    }
                    const one_day = 1000 * 60 * 60 * 24;
                    let days = Math.ceil(
                        (bmas.getTime() - cDate.getTime()) / one_day
                    );
                    result.birthDate = days + ' Days to go';

                    return res.status(200).send({
                        status: 200,
                        message: 'success',
                        data: result,
                    });
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({
                            status: 500,
                            message: 'Internal Error',
                        });
                    }
                });
        } catch (error) {
            console.log(error);
            if (error) {
                return res.status(500).send({
                    status: 500,
                    message: 'Internal Error',
                });
            }
        }
    }
}
module.exports = new Users();