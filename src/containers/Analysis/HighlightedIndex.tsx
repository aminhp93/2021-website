import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { BILLION_UNIT } from 'utils/unit';

import {
    getYearlyFinancialInfo,
    getQuarterlyFinancialInfo,
    getLastestFinancialReports
} from 'reducers/stocks';
import { getLastestFinancialInfo } from 'reducers/latestFinancialInfo'

interface IProps {
    symbol: string;
    getYearlyFinancialInfo: any;
    getQuarterlyFinancialInfo: any;
    getLastestFinancialInfo: any;
    getLastestFinancialReports: any;
}

interface IState {
    symbol: string;
    QuarterlyFinancialInfoArray: any,
    YearlyFinancialInfoArray: any,
    LastestFinancialInfoObj: any,
    YearlyFinancialReportsArray_1: any,
    YearlyFinancialReportsArray_2: any,
    YearlyFinancialReportsArray_3: any,
    YearlyFinancialReportsArray_4: any,
}

class HighlightedIndex extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            symbol: props.symbol,
            QuarterlyFinancialInfoArray: [],
            YearlyFinancialInfoArray: [],
            LastestFinancialInfoObj: {},
            YearlyFinancialReportsArray_1: [],
            YearlyFinancialReportsArray_2: [],
            YearlyFinancialReportsArray_3: [],
            YearlyFinancialReportsArray_4: [],
        }
    }

    async componentDidMount() {
        this.crawlData();
    }

    crawlData = async () => {
        try {
            const { symbol } = this.state;
            // const res1 = await this.props.getYearlyFinancialInfo(symbol)
            // const YearlyFinancialInfoArray = res1.data
            // const res2 = await this.props.getQuarterlyFinancialInfo(symbol)
            // const QuarterlyFinancialInfoArray = res2.data
            // const res3 = await this.props.getLastestFinancialInfo({ stockId: symbol })
            // const LastestFinancialInfoObj = res3.data
            // if (YearlyFinancialInfoArray && QuarterlyFinancialInfoArray && LastestFinancialInfoObj) {
            //     this.setState({
            //         YearlyFinancialInfoArray,
            //         QuarterlyFinancialInfoArray,
            //         LastestFinancialInfoObj
            //     })
            // }
            const quarter = 0
            const year = 2020

            const type_index = 4
            const res1 = await this.props.getLastestFinancialReports({ financialType: 1, year, quarter, symbol: this.props.symbol })
            const res2 = await this.props.getLastestFinancialReports({ financialType: 2, year, quarter, symbol: this.props.symbol })
            const res3 = await this.props.getLastestFinancialReports({ financialType: 3, year, quarter, symbol: this.props.symbol })
            const res4 = await this.props.getLastestFinancialReports({ financialType: 4, year, quarter, symbol: this.props.symbol })
            this.setState({
                YearlyFinancialReportsArray_1: (res1 || {}).data || [],
                YearlyFinancialReportsArray_2: (res2 || {}).data || [],
                YearlyFinancialReportsArray_3: (res3 || {}).data || [],
                YearlyFinancialReportsArray_4: (res4 || {}).data || [],
            }) 
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        console.log(this.state)
        const {
            YearlyFinancialReportsArray_1,
            YearlyFinancialReportsArray_2,
            YearlyFinancialReportsArray_3,
            YearlyFinancialReportsArray_4
        } = this.state;
        const luu_chuyen_HDKD_104 = YearlyFinancialReportsArray_4.filter(i => i.ID === 104)
        const luu_chuyen_HDKD_104_2018 = ((((luu_chuyen_HDKD_104[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const luu_chuyen_HDKD_104_2019 = ((((luu_chuyen_HDKD_104[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const diff_luu_chuyen_HDKD_104 = Number(luu_chuyen_HDKD_104_2019) - Number(luu_chuyen_HDKD_104_2018)

        const luu_chuyen_HDKD_10301 = YearlyFinancialReportsArray_4.filter(i => i.ID === 10301)
        const luu_chuyen_HDKD_10301_2018 = ((((luu_chuyen_HDKD_10301[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const luu_chuyen_HDKD_10301_2019 = ((((luu_chuyen_HDKD_10301[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const diff_luu_chuyen_HDKD_10301 = Number(luu_chuyen_HDKD_10301_2019) - Number(luu_chuyen_HDKD_10301_2018)

        const luu_chuyen_HDDT_212 = YearlyFinancialReportsArray_4.filter(i => i.ID === 212)
        const luu_chuyen_HDDT_212_2018 = ((((luu_chuyen_HDDT_212[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const luu_chuyen_HDDT_212_2019 = ((((luu_chuyen_HDDT_212[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const diff_luu_chuyen_HDDT_212 = Number(luu_chuyen_HDDT_212_2019) - Number(luu_chuyen_HDDT_212_2018)

        const luu_chuyen_HDTC_311 = YearlyFinancialReportsArray_4.filter(i => i.ID === 311)
        const luu_chuyen_HDTC_311_2018 = ((((luu_chuyen_HDTC_311[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const luu_chuyen_HDTC_311_2019 = ((((luu_chuyen_HDTC_311[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const diff_luu_chuyen_HDTC_311 = Number(luu_chuyen_HDTC_311_2019) - Number(luu_chuyen_HDTC_311_2018)

        // 
        const CAN_DOI_no_tai_chinh_ngan_han_3010101 = YearlyFinancialReportsArray_1.filter(i => i.ID === 3010101)
        const CAN_DOI_no_tai_chinh_ngan_han_3010101_2018 = ((((CAN_DOI_no_tai_chinh_ngan_han_3010101[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const CAN_DOI_no_tai_chinh_ngan_han_3010101_2019 = ((((CAN_DOI_no_tai_chinh_ngan_han_3010101[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)

        const CAN_DOI_no_tai_chinh_dai_han_3010206 = YearlyFinancialReportsArray_1.filter(i => i.ID === 3010206)
        const CAN_DOI_no_tai_chinh_dai_han_3010206_2018 = ((((CAN_DOI_no_tai_chinh_dai_han_3010206[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const CAN_DOI_no_tai_chinh_dai_han_3010206_2019 = ((((CAN_DOI_no_tai_chinh_dai_han_3010206[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)

        const CAN_DOI_tong_vay_2019 = Number(CAN_DOI_no_tai_chinh_ngan_han_3010101_2019) + Number(CAN_DOI_no_tai_chinh_dai_han_3010206_2019)
        const CAN_DOI_tong_vay_2018 = Number(CAN_DOI_no_tai_chinh_ngan_han_3010101_2018) + Number(CAN_DOI_no_tai_chinh_dai_han_3010206_2018)
        
        const CAN_DOI_VCSH_30201 = YearlyFinancialReportsArray_1.filter(i => i.ID === 30201)
        const CAN_DOI_VCSH_30201_2019 = ((((CAN_DOI_VCSH_30201[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)

        const RATIO_tong_vay_VCSH = Number((Number(CAN_DOI_tong_vay_2019) / Number(CAN_DOI_VCSH_30201_2019)).toFixed(1))
        const RATIO_tong_vay = Number((CAN_DOI_tong_vay_2019 / CAN_DOI_tong_vay_2018).toFixed(1))
        
        // 
        const KQKD_doanh_thu_thuan_3 = YearlyFinancialReportsArray_2.filter(i => i.ID === 3)
        const KQKD_doanh_thu_thuan_3_2018 = ((((KQKD_doanh_thu_thuan_3[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const KQKD_doanh_thu_thuan_3_2019 = ((((KQKD_doanh_thu_thuan_3[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const RATIO_doanh_thu_thuan = Number((Number(KQKD_doanh_thu_thuan_3_2019) / Number(KQKD_doanh_thu_thuan_3_2018)).toFixed(2))

        const KQKD_loi_nhuan_gop_3 = YearlyFinancialReportsArray_2.filter(i => i.ID === 5)
        const KQKD_loi_nhuan_gop_3_2018 = ((((KQKD_loi_nhuan_gop_3[0] || {}).Values || []).filter(i => i.Year === 2018)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const KQKD_loi_nhuan_gop_3_2019 = ((((KQKD_loi_nhuan_gop_3[0] || {}).Values || []).filter(i => i.Year === 2019)[0] || {}).Value / BILLION_UNIT).toFixed(0)
        const RATIO_loi_nhuan_gop = Number((Number(KQKD_loi_nhuan_gop_3_2019) / Number(KQKD_loi_nhuan_gop_3_2018)).toFixed(2))


        return (
            <div className="flex HighlightedIndex">
                HighlightedIndex: 
                <div>
                    <div>Bao cao luu chuyen tien te</div>
                    <div>
                        Hoat dong kinh doanh
                        <div>{`HDKD `} 
                            <span className={diff_luu_chuyen_HDKD_104 > 0 ? 'bg-green white': 'bg-red white'}>{diff_luu_chuyen_HDKD_104} ty</span>
                            ({luu_chuyen_HDKD_104_2018} {`=>`} {luu_chuyen_HDKD_104_2019})
                        </div>
                        <div>{`Khoan phai thu `} 
                            <span className={diff_luu_chuyen_HDKD_10301 > 0 ? 'bg-green white': 'bg-red white'}>{diff_luu_chuyen_HDKD_10301} ty</span>
                            ({luu_chuyen_HDKD_10301_2018} {`=>`} {luu_chuyen_HDKD_10301_2019})
                        </div>
                        <div>{`Khoan phai tra `} 
                            <span className={diff_luu_chuyen_HDDT_212 > 0 ? 'bg-green white': 'bg-red white'}>{diff_luu_chuyen_HDDT_212} ty</span>
                            ({luu_chuyen_HDDT_212_2018} {`=>`} {luu_chuyen_HDDT_212_2019})
                        </div>
                        {/* <div>VCS</div>
                        <div>{`HDKD: tang 564 ty`}</div>
                        <div>{`LNTT: tang 335 ty`}</div>
                        <div>{`Hang ton kho: tang 554 ty`}</div>
                        <div>{`Khoan phai thu: tang 265 ty`}</div> */}

                    </div>
                    <div>------</div>
                    <div>
                        <div>{`Hoat dong dau tu `}
                            <span className={diff_luu_chuyen_HDDT_212 > 0 ? 'bg-green white': 'bg-red white'}>{diff_luu_chuyen_HDDT_212} ty</span>
                            ({luu_chuyen_HDDT_212_2018} {`=>`} {luu_chuyen_HDDT_212_2019})
                        </div>
                        <div>{`Note: thuong hoat dong dau tu am k sao. Nhung neu hoat dong kinh doanh am va hoat dong dau tu am thi co van de`}</div>
                        {/* <div>VCS</div> */}
                        {/* <div>giam 13 ty</div> */}
                    </div>
                    <div>------</div>
                    <div>
                        <div>{`Hoat dong tai chinh `}
                            <span className={diff_luu_chuyen_HDTC_311 > 0 ? 'bg-green white': 'bg-red white'}>{diff_luu_chuyen_HDTC_311} ty</span>
                            ({luu_chuyen_HDTC_311_2018} {`=>`} {luu_chuyen_HDTC_311_2019})
                        </div>
                        <div>{`Note: Doanh nghiep tang vay no de day hoat dong san xuat kinh doanh`}</div>
                        {/* <div>VCS</div> */}
                        {/* <div>{`Am them 308 ty: mang di tra no hoac tra co tuc ==> tot`}</div> */}
                    </div>
                    <div>------</div>
                    <div>
                        {`Note: Tien chay ra khoi doanh nghiep nhu nao? Lau chua? (5 nam)`}
                    </div>                    
                </div>
                <div>
                    <div>Can doi ke toan</div>
                    <div>
                        <div>{`No vay tai chinh ngan han ${CAN_DOI_no_tai_chinh_ngan_han_3010101_2019} ty`}</div>
                        <div>{`No vay tai chinh dai han ${CAN_DOI_no_tai_chinh_dai_han_3010206_2019} ty`}</div>
                        <div>{`Tong vay: ${CAN_DOI_tong_vay_2019} ty`}</div>
                        <div>{`VCSH: ${CAN_DOI_VCSH_30201_2019} ty`}</div>
                        <div>
                            {`Ty le no/VCSH: `}
                            <span className={RATIO_tong_vay_VCSH > 1 ? 'bg-green white': 'bg-red white'}>{RATIO_tong_vay_VCSH}</span>
                        </div>
                        <div>{`Note: thuong hoat dong dau tu am k sao. Nhung neu hoat dong kinh doanh am va hoat dong dau tu am thi co van de`}</div>
                        {/* <div>VCS</div> */}
                        {/* <div>giam 13 ty</div> */}
                    </div>
                   
                    <div>
                        {`Tong no vay so vs nam ngoai `}
                        <span className={RATIO_tong_vay < 1 ? 'bg-green white': 'bg-red white'}>{RATIO_tong_vay}</span>
                        ({CAN_DOI_tong_vay_2019} {`=>`} {CAN_DOI_tong_vay_2018})
                     </div>
                    {/* <div>VCS</div>
                    <div>No vay tai chinh ngan han: 1417 ty</div>
                    <div>No vay tai chinh dai han: 253 ty</div>
                    <div>Tong vay: 1670 ty</div>
                    <div>VCSH: 3448 ty</div>
                    <div>{`No vay/ VCSH: 0.49 ==> an toan `}</div>
                    <div>{`Tong no vay so vs nam ngoai: 1670/1150 ==> tang 45%: hop ly vi doanh thu tang 22%`}</div> */}
                    <div>------</div>
                    <div>
                        Note
                        <div>No vay tai chinh: dung ngay phai tra ngan hang, no vay doi tac thi co the thu xep sau duoc</div>
                    </div>
                </div>
                <div>
                    <div>KQKD</div>
                    <div>
                        {`Doanh thu `}
                        <span className={RATIO_doanh_thu_thuan > 1 ? 'bg-green white': 'bg-red white'}>{RATIO_doanh_thu_thuan}</span>
                        ({KQKD_doanh_thu_thuan_3_2018} {`=>`} {KQKD_doanh_thu_thuan_3_2019})
                     </div>
                     <div>
                        {`Loi nhuan gop `}
                        <span className={RATIO_loi_nhuan_gop > 1 ? 'bg-green white': 'bg-red white'}>{RATIO_loi_nhuan_gop}</span>
                        ({KQKD_loi_nhuan_gop_3_2018} {`=>`} {KQKD_loi_nhuan_gop_3_2019})
                     </div>
                    <div>{`LN gop, LNST giam: LN chat luong kem, tien k ve trong 3 nam`}</div>
                    {/* <div>VCS</div>
                    <div>Doanh thu tang 23%</div>
                    <div>LN gop tang 28%</div> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedSymbol: get(state, 'selectedSymbol'),
        companies: get(state, 'companies'),
        stocks: get(state, 'stocks'),
        decisiveIndexes: get(state, 'decisiveIndexes'),
        latestFinancialInfo: get(state, 'latestFinancialInfo')
    }
}

const mapDispatchToProps = {
    getYearlyFinancialInfo,
    getQuarterlyFinancialInfo,
    getLastestFinancialInfo,
    getLastestFinancialReports
}

export default connect(mapStateToProps, mapDispatchToProps)(HighlightedIndex);
