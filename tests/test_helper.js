const Merchant = require('../models/merchant');

const initialMerchants = [
    {
        _id: '636c65fe7d63de93d0c7f9b4',
        name: 'Smile Tutor',
        aboutUs: 'SmileTutor is the industry-leading tuition agency that delivers an unparalleled level of service. With the industry’s most comprehensive tutor database and experienced coordinators, our services help parents, students, and tutors find each other more Efficiently, Effectively, and Easily.',
        imgUrl: 'assets/img/merchants/smile.avif',
        location: 'WCEGA TOWER 21 Bukit Batok Crescent #22-76/77 S658065',
        coord: '1.3373358061749812, 103.75979398873014',
        phoneNo: '62664475',
        email: 'contactus@smiltetutor.sg',
        lastOnline: 3,
        products: [],
    },

    {
        _id: '635abc7fb01737e727fb4b36',
        name: 'In Good Company',
        imgUrl: 'assets/img/merchants/igc.avif',
        location: '2 Orchard Turn, #B1 - 06, Singapore 238801',
        phoneNo: '65094786',
        email: 'TeamSL.WAD2.2022@gmail.com',
        lastOnline: 9,
        products: [
            { $oid: '635abd38b01737e727fb4b38' },
            { $oid: '63613fddde3eb86075932c20' },
            { $oid: '63743c4953544ec3c85d43d0' },
        ],
        aboutUs: 'Characteristically modern and quietly confident, IN GOOD COMPANY is designed to form the building blocks of a versatile wardrobe. New modern classics are offered in Womenswear and Menswear. Ships Worldwide.',
        coord: '1.309221002384061, 103.83339112441992',
        password: '123456789',
    },
];

const merchantsInDb = async () => {
    const merchants = await Merchant.find({})
    return merchants.map((merchant) => merchant.toJSON());
};

module.exports = {
    initialMerchants, merchantsInDb,
};
