import axios from "axios";

const TOKEN_KEY = 'user-token'
const DISPLAY_USERNAME = 'displayUsername'
const IS_SUPERUSER = 'is_superuser'
const IS_DESIGNER = 'is_designer'
const IS_MEMBER = 'is_member'
const USERTYPE = 'userType'
let isDebug = false
let numberInCart = 0

const Service = {

    isDebug() {
        return isDebug
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },

    getUsername(token) {
        if (token) {
            // console.log("Has Token");
            let displayUsername = localStorage.getItem(DISPLAY_USERNAME);
            return displayUsername
        }
        else {
            console.log("No Token");
            return null
        }
    },
    getUserType(token) {
        if (token) {
            // console.log("Has Token");

            let userType = localStorage.getItem(USERTYPE);
            let int_userType = Number(userType)
            // console.log(userType + typeof userType)
            console.log(int_userType + typeof int_userType)

            return int_userType

        }
        else {
            console.log("No Token");
            return null
        }
    },

    getBackendURL() {
        if (isDebug) {
            let rootUrl = "http://127.0.0.1:8000/"
            // let rootUrl = "http://20.184.55.203:8000/"
            return rootUrl
        }
        else {
            let rootUrl = "http://www.mdisonlinegallery.tk:8000/"
            // let rootUrl = "http:/mdisonlinegallery.tk:8000/"
            return rootUrl
        }
    },

    isUserTypeMatch(token) {
        if (token) {
            let local_userType = Service.getUserType(this.token)
            axios
                .get(this.getBackendURL() + "api/me", {
                    headers: { Authorization: "Token " + token }
                })
                .then(
                    res => {
                        if (String(local_userType) == String(res.data.get_user_role)) {
                            // if (Service.isDebug) {
                            //     console.log("Matched");
                            // }
                            return ture
                        } else {
                            // if (Service.isDebug) {
                            //     console.log("Not Match");
                            // }
                            return false
                        }
                    }
                )
                .catch(err => {
                    if (isDebug) {
                        console.log(err.response)
                    }
                }


                );
        } else {
            console.log("No Token");
            return null
        }

    },
    getNumberInCart(token) {
        if (token) {
            axios
                .get(Service.getBackendURL() + "api/cart/", {
                    headers: {
                        Authorization: "Token " + token,
                        "Content-type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    // let price_total = 0;
                    // for (var i = 0; i < this.myCartDigitalArts.length; i++) {
                    //   price_total =
                    //     price_total +
                    //     Number(this.myCartDigitalArts[i].digital_art_price);
                    //   // console.log(price_total);
                    // }
                    // this.price_total = price_total;
                    if (Service.isDebug) {
                        console.log(res.data.length);
                    }
                    return res.data.length
                })
                .catch((err) => {
                    if (Service.isDebug) {
                        console.log(err.response);
                    }
                    return 0
                });
        }else{
            return 0
        }

    }

}

export { Service }