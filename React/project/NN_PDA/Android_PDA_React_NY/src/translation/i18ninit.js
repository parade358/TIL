import { NaturePeopleOutlined } from "@material-ui/icons";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const resource = {
    K: {
        translation: null,
    },
    E: {
        translation: null,
    }
};
i18n.use(initReactI18next).init({
    resources: resource,
    lng: "ko",
    fallbackLng: "ko",
    debug: true,
    keySeparator: false,
    nsSeparator: false,
    interpolation: {escapeValue: false},
});

export default i18n;

