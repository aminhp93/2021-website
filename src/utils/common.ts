import { cloneDeep, each } from 'lodash';
import moment from 'moment';
import { INDUSTRY_TYPE_LIST_STOCK } from 'utils/constant'

export const LATEST_FINANCIAL_REPORTS = {
    TYPE_1: 'Can doi ke toan',
    TYPE_2: 'Ket qua kinh doanh',
    TYPE_3: 'Luu chuyen tien te - Truc tiep',
    TYPE_4: 'Luu chuyen tien te - Gian tiep',
}

export function formatNumber(num) {
    if (!num) return num
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function mapColorPriceChange(data) {
    if (!data) return ''
    if (data >= 6) {
        return 'purple'
    } else if (0 < data && data < 6) {
        return 'green'
    } else if (data === 0) {
        return 'white'
    } else if (-6 < data && data < 0) {
        return 'red'
    } else if (data <= -6) {
        return 'blue'
    }
}

export function mapColorVolumeChange(data) {
    if (!data) return ''
    if (data >= 1.5) {
        return 'green'
    }
}


export function mapColorFinancialReportChange(data) {
    if (!data) return ''
    if (data > 0) {
        return 'green'
    } else if (data === 0) {
        return 'white'
    } else if (data < 0) {
        return 'red'
    }
}

export function mapArrayToKeyValue(data) {
    const result = {}
    data.forEach(item => {
        result[item.id] = item
    })
    return result
}

export function mapDataTwoDate(data1, data2, allStocks) {
    if (!data1 || !data2 || !allStocks) return []
    const data1Obj = {};
    const data2Obj = {};
    data1.forEach(item => {
        data1Obj[item.Stock] = item
    })
    data2.forEach(item => {
        data2Obj[item.Stock] = item
    })
    for (let i = 0; i < data1.length; i++) {
        data1[i].TodayCapital = Number((data1[i].PriceClose * data1[i].DealVolume / 1000000000).toFixed(0))
        data1[i].MarketCap = Number((data1[i].MarketCap / 1000000000).toFixed(0))
        if (!data2Obj[data1[i].Stock]) {
            // 
        } else {
            const data2Item = data2Obj[data1[i].Stock]
            data1[i].YesterdayPriceClose = data2Item.PriceClose
            data1[i].PriceChange = Number(((data1[i].PriceClose - data2Item.PriceClose) * 100 / data2Item.PriceClose).toFixed(1))
            data1[i].YesterdayVolumeClose = data2Item.DealVolume
            data1[i].VolumeChange = Number(((data1[i].DealVolume - data2Item.DealVolume) * 100 / data2Item.DealVolume).toFixed(1))
        }
        data1[i].Stock = allStocks[data1[i].Stock].Symbol
    }
    return data1;
}

export const arrayToKeyValue = (array, key = 'id') =>
    Object.fromEntries(array.map(item => [item[key], item]))

export const mapDataImportantIndexes = (dataType1, dataType2, dataType3, dataType4, dataType5) => {
    if (!dataType1 || !dataType2) return []
    const result = []

    // GET INFO
    // const taiSanNganHan = dataType1.filter(i => i.ID === 101)[0]
    const noNganHan = dataType1.filter(i => i.ID === 30101)[0]
    // const hangTonKho = dataType1.filter(i => i.ID === 10104)[0]
    const tienVsTuongDuongTien = dataType1.filter(i => i.ID === 10101)[0]
    const loiNhuanTruocThue = dataType2.filter(i => i.ID === 15)[0]
    const chiPhiLayVay = dataType2.filter(i => i.ID === 701)[0]
    const noVay = dataType1.filter(i => i.ID === 301)[0]
    const noVayDaiHan = dataType1.filter(i => i.ID === 30102)[0]
    const noVayNganHan = dataType1.filter(i => i.ID === 30101)[0]
    const VCSH = dataType1.filter(i => i.ID === 302)[0]
    const tongCongNguonVon = dataType1.filter(i => i.ID === 4)[0]
    const doanhThuThuan = dataType2.filter(i => i.ID === 3)[0]
    // const phaiThuNganHanKhachHang = dataType1.filter(i => i.ID === 1010301)[0]
    // const phaiThuDaiHanKhachHang = dataType1.filter(i => i.ID === 1020101)[0]
    const phaiTraNguoiBanNganHan = dataType1.filter(i => i.ID === 302)[0]
    const phaiTraNguoiBanDaiHan = dataType1.filter(i => i.ID === 302)[0]
    // const tongCongTaiSan = dataType2.filter(i => i.ID === 2)[0]
    // const loiNhuanGop = dataType1.filter(i => i.ID === 15)[0]
    const LNST = dataType1.filter(i => i.ID === 19)[0]
    // const PriceClose = dataType4[0].PriceClose

    // GET DIRECT INDEX
    const {
        // PE,
        // PS,
        PB,
        // EPS,
        QuickRatio,
        CurrentRatio,
        TotalDebtOverEquity,
        // TotalDebtOverAssets,
        // TotalAssetsTurnover,
        InventoryTurnover,
        ReceivablesTurnover,
        GrossMargin,
        // OperatingMargin,
        // EBITMargin,
        // NetProfitMargin,
        ROA,
        ROE,
        // ROIC,
        DilutedEPS,
        DilutedPE
    } = dataType5

    const yearsArray = [2014, 2015, 2016, 2017, 2018, 2019, 'Current']

    // INDEX 1
    const tyLeThanhToanHienHanhValues = [];
    const tyLeThanhToanNhanhValues = [];
    const tyLeThanhToanTucThoiValues = [];
    const khaNangThanhToanLaiVayValues = [];
    // INDEX 2
    const tyLeNoVay_VCSHValues = []
    const tyLeNovayDaiHan_VCSHValues = []
    const tyLeNoVayNganHan_VCSHValues = []
    // INDEX 3
    const soVongQuayHangTonKhoValues = []
    const soVongQuayPhaiThuKhachHangValues = []
    const soVongQuayPhaiTraNguoiBanValues = []
    const vongQuayTienMatValues = []
    const vongQuayTaiSanValues = []
    // INDEX 4
    const bienLoiNhuanGopValues = []
    const ROSValues = []
    const ROAValues = []
    const ROEValues = []
    const heSoDonBayTaiChinhValues = []
    const EPSValues = []
    // INDEX 5
    // const tyLeChiTraCoTucValues = []
    // const tySuatCoTucValues = []
    // INDEX 6
    const PEValues = []
    const PBValues = []

    yearsArray.forEach(i => {
        // const taiSanNganHanValue = taiSanNganHan && taiSanNganHan.Values && taiSanNganHan.Values.filter(j => j.Year === i).length && taiSanNganHan.Values.filter(j => j.Year === i)[0].Value
        const noNganHanValue = noNganHan && noNganHan.Values && noNganHan.Values.filter(j => j.Year === i).length && noNganHan.Values.filter(j => j.Year === i)[0].Value
        // const hangTonKhoValue = hangTonKho && hangTonKho.Values && hangTonKho.Values.filter(j => j.Year === i).length && hangTonKho.Values.filter(j => j.Year === i)[0].Value
        const tienVsTuongDuongTienValue = tienVsTuongDuongTien && tienVsTuongDuongTien.Values && tienVsTuongDuongTien.Values.filter(j => j.Year === i).length && tienVsTuongDuongTien.Values.filter(j => j.Year === i)[0].Value
        const loiNhuanTruocThueValue = loiNhuanTruocThue && loiNhuanTruocThue.Values && loiNhuanTruocThue.Values.filter(j => j.Year === i).length && loiNhuanTruocThue.Values.filter(j => j.Year === i)[0].Value
        const chiPhiLayVayValue = chiPhiLayVay && chiPhiLayVay.Values && chiPhiLayVay.Values.filter(j => j.Year === i).length && chiPhiLayVay.Values.filter(j => j.Year === i)[0].Value
        const noVayValue = noVay && noVay.Values && noVay.Values.filter(j => j.Year === i).length && noVay.Values.filter(j => j.Year === i)[0].Value
        const noVayDaiHanValue = noVayDaiHan && noVayDaiHan.Values && noVayDaiHan.Values.filter(j => j.Year === i).length && noVayDaiHan.Values.filter(j => j.Year === i)[0].Value
        const noVayNganHanValue = noVayNganHan && noVayNganHan.Values && noVayNganHan.Values.filter(j => j.Year === i).length && noVayNganHan.Values.filter(j => j.Year === i)[0].Value
        const VCSHValue = VCSH && VCSH.Values && VCSH.Values.filter(j => j.Year === i).length && VCSH.Values.filter(j => j.Year === i)[0].Value
        const tongCongNguonVonValue = tongCongNguonVon && tongCongNguonVon.Values && tongCongNguonVon.Values.filter(j => j.Year === i).length && tongCongNguonVon.Values.filter(j => j.Year === i)[0].Value
        const doanhThuThuanValue = doanhThuThuan && doanhThuThuan.Values && doanhThuThuan.Values.filter(j => j.Year === i).length && doanhThuThuan.Values.filter(j => j.Year === i)[0].Value
        // const phaiThuNganHanKhachHangValue = phaiThuNganHanKhachHang && phaiThuNganHanKhachHang.Values && phaiThuNganHanKhachHang.Values.filter(j => j.Year === i).length && phaiThuNganHanKhachHang.Values.filter(j => j.Year === i)[0].Value
        // const phaiThuDaiHanKhachHangValue = phaiThuDaiHanKhachHang && phaiThuDaiHanKhachHang.Values && phaiThuDaiHanKhachHang.Values.filter(j => j.Year === i).length && phaiThuDaiHanKhachHang.Values.filter(j => j.Year === i)[0].Value
        const phaiTraNguoiBanNganHanValue = phaiTraNguoiBanNganHan && phaiTraNguoiBanNganHan.Values && phaiTraNguoiBanNganHan.Values.filter(j => j.Year === i).length && phaiTraNguoiBanNganHan.Values.filter(j => j.Year === i)[0].Value
        const phaiTraNguoiBanDaiHanValue = phaiTraNguoiBanDaiHan && phaiTraNguoiBanDaiHan.Values && phaiTraNguoiBanDaiHan.Values.filter(j => j.Year === i).length && phaiTraNguoiBanDaiHan.Values.filter(j => j.Year === i)[0].Value
        // const tongCongTaiSanValue = tongCongTaiSan && tongCongTaiSan.Values && phaiTraNguoiBanDaiHan.Values.filter(j => j.Year === i).length && phaiTraNguoiBanDaiHan.Values.filter(j => j.Year === i)[0].Value
        // const loiNhuanGopValue = loiNhuanGop && loiNhuanGop.Values && phaiTraNguoiBanDaiHan.Values.filter(j => j.Year === i).length && phaiTraNguoiBanDaiHan.Values.filter(j => j.Year === i)[0].Value
        const LNSTValue = LNST && LNST.Values && LNST.Values.filter(j => j.Year === i).length && LNST.Values.filter(j => j.Year === i)[0].Value

        const dataType3Indexes = dataType3.filter(j => Number(j.Year) === i)

        // INDEX 1
        tyLeThanhToanHienHanhValues.push({
            Year: i,
            Quarter: 0,
            // Value: (taiSanNganHanValue && noNganHanValue) ? taiSanNganHanValue / noNganHanValue : null
            Value: i === 'Current' ? CurrentRatio : (dataType3Indexes.length && dataType3Indexes[0].CurrentRatio)
        })
        tyLeThanhToanNhanhValues.push({
            Year: i,
            Quarter: 0,
            // Value: (taiSanNganHanValue && noNganHanValue && hangTonKhoValue) ? (taiSanNganHanValue - hangTonKhoValue) / noNganHanValue : null
            Value: i === 'Current' ? QuickRatio : (dataType3Indexes.length && dataType3Indexes[0].QuickRatio)
        })
        tyLeThanhToanTucThoiValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : ((tienVsTuongDuongTienValue && noNganHanValue) ? tienVsTuongDuongTienValue / noNganHanValue : null)
        })
        khaNangThanhToanLaiVayValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : ((loiNhuanTruocThueValue && chiPhiLayVayValue) ? (loiNhuanTruocThueValue + chiPhiLayVayValue) / chiPhiLayVayValue : null)
        })
        // INDEX 2
        tyLeNoVay_VCSHValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? TotalDebtOverEquity : ((noVayValue && VCSHValue) ? noVayValue / VCSHValue : null)
        })
        tyLeNovayDaiHan_VCSHValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : ((noVayDaiHanValue && VCSHValue) ? noVayDaiHanValue / VCSHValue : null)
        })
        tyLeNoVayNganHan_VCSHValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : ((noVayNganHanValue && VCSHValue) ? noVayNganHanValue / VCSHValue : null)
        })
        // INDEX 3

        // let soVongQuayHangTonKho = (tongCongNguonVonValue && hangTonKhoValue) ? tongCongNguonVonValue / hangTonKhoValue : null
        // let soVongQuayPhaiThuKhachHang = (doanhThuThuanValue && (phaiThuNganHanKhachHangValue || phaiThuNganHanKhachHangValue === 0) && (phaiThuDaiHanKhachHangValue || phaiThuDaiHanKhachHangValue === 0)) ? doanhThuThuanValue / (phaiThuNganHanKhachHangValue + phaiThuDaiHanKhachHangValue) : null
        const soVongQuayPhaiTraNguoiBan = (tongCongNguonVonValue && (phaiTraNguoiBanNganHanValue || phaiTraNguoiBanNganHanValue === 0) && (phaiTraNguoiBanDaiHanValue || phaiTraNguoiBanDaiHanValue === 0)) ? tongCongNguonVonValue / (phaiTraNguoiBanNganHanValue + phaiTraNguoiBanDaiHanValue) : null
        const vongQuayTienMat = (
            dataType3Indexes.length
            && dataType3Indexes[0].InventoryTurnover
            && dataType3Indexes[0].ReceivablesTurnover
            && soVongQuayPhaiTraNguoiBan
        )
            ? (360 / dataType3Indexes[0].InventoryTurnover + 360 / dataType3Indexes[0].ReceivablesTurnover + 360 / soVongQuayPhaiTraNguoiBan)
            : null
        soVongQuayHangTonKhoValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? InventoryTurnover : (dataType3Indexes.length && dataType3Indexes[0].InventoryTurnover)
        })
        soVongQuayPhaiThuKhachHangValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? ReceivablesTurnover : (dataType3Indexes.length && dataType3Indexes[0].ReceivablesTurnover)
        })
        soVongQuayPhaiTraNguoiBanValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : soVongQuayPhaiTraNguoiBan
        })
        vongQuayTienMatValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : vongQuayTienMat
        })
        vongQuayTaiSanValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : (dataType3Indexes.length && dataType3Indexes[0].AssetsTurnover)
            // (doanhThuThuanValue && tongCongTaiSanValue) ? doanhThuThuanValue / tongCongTaiSanValue : null
        })
        // INDEX 4
        bienLoiNhuanGopValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? GrossMargin : (dataType3Indexes.length && dataType3Indexes[0].GrossMargin)
        })
        ROSValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? null : ((LNSTValue && doanhThuThuanValue) ? LNSTValue / doanhThuThuanValue : null)
        })
        ROAValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? ROA : (dataType3Indexes.length && dataType3Indexes[0].ROA)
        })
        ROEValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? ROE : (dataType3Indexes.length && dataType3Indexes[0].ROE)
        })
        heSoDonBayTaiChinhValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? ROE / ROA : ((dataType3Indexes.length && dataType3Indexes[0].ROE && dataType3Indexes[0].ROA) ? dataType3Indexes[0].ROE / dataType3Indexes[0].ROA : null)
        })
        EPSValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? DilutedEPS : (dataType3Indexes.length && dataType3Indexes[0].DilutedEPS)
        })
        // INDEX 5
        // INDEX 6
        PEValues.push({
            Year: i,
            Quarter: 0,
            // Value: (PriceClose && dataType3Indexes.length && dataType3Indexes[0].DilutedEPS) ? PriceClose / dataType3Indexes[0].DilutedEPS : null
            Value: i === 'Current' ? DilutedPE : DilutedPE
        })
        PBValues.push({
            Year: i,
            Quarter: 0,
            Value: i === 'Current' ? PB : PB
        })


    })

    // INDEX 1
    // result.push(taiSanNganHan)
    // result.push(noNganHan)
    result.push({
        ID: "tyLeThanhToanHienHanh",
        Name: "tyLeThanhToanHienHanh",
        Values: tyLeThanhToanHienHanhValues
    })

    // result.push(taiSanNganHan)
    // result.push(noNganHan)
    result.push({
        ID: "tyLeThanhToanNhanh",
        Name: "tyLeThanhToanNhanh",
        Values: tyLeThanhToanNhanhValues
    })

    // result.push(taiSanNganHan)
    // result.push(noNganHan)
    result.push({
        ID: "tyLeThanhToanTucThoi",
        Name: "tyLeThanhToanTucThoi",
        Values: tyLeThanhToanTucThoiValues
    })


    // result.push(taiSanNganHan)
    // result.push(noNganHan)
    result.push({
        ID: "khaNangThanhToanLaiVay",
        Name: "khaNangThanhToanLaiVay",
        Values: khaNangThanhToanLaiVayValues
    })

    // INDEX 2
    // result.push(noVay)
    // result.push(VCSH)
    result.push({
        ID: "tyLeNoVay_VCSH",
        Name: "tyLeNoVay_VCSH",
        Values: tyLeNoVay_VCSHValues
    })

    // result.push(noVayDaiHan)
    // result.push(VCSH)
    result.push({
        ID: "tyLeNovayDaiHan_VCSH",
        Name: "tyLeNovayDaiHan_VCSH",
        Values: tyLeNovayDaiHan_VCSHValues
    })

    // result.push(noVayNganHan)
    // result.push(VCSH)
    result.push({
        ID: "tyLeNoVayNganHan_VCSH",
        Name: "tyLeNoVayNganHan_VCSH",
        Values: tyLeNoVayNganHan_VCSHValues
    })

    // INDEX 3
    // result.push(tongCongNguonVon)
    // result.push(hangTonKho)
    result.push({
        ID: "soVongQuayHangTonKho",
        Name: "soVongQuayHangTonKho",
        Values: soVongQuayHangTonKhoValues
    })

    // result.push(doanhThuThuan)
    // result.push(phaiThuNganHanKhachHang)
    // result.push(phaiThuDaiHanKhachHang)
    result.push({
        ID: "soVongQuayPhaiThuKhachHang",
        Name: "soVongQuayPhaiThuKhachHang",
        Values: soVongQuayPhaiThuKhachHangValues
    })

    // result.push(tongCongNguonVon)
    // // result.push(phaiTraNguoiBanNganHan)
    // result.push(phaiTraNguoiBanDaiHan)
    result.push({
        ID: "soVongQuayPhaiTraNguoiBan",
        Name: "soVongQuayPhaiTraNguoiBan",
        Values: soVongQuayPhaiTraNguoiBanValues
    })

    result.push({
        ID: "vongQuayTienMat",
        Name: "vongQuayTienMat",
        Values: vongQuayTienMatValues
    })

    // result.push(doanhThuThuan)
    // result.push(tongCongTaiSan)
    result.push({
        ID: "vongQuayTaiSan",
        Name: "vongQuayTaiSan",
        Values: vongQuayTaiSanValues
    })

    // INDEX 4
    result.push({
        ID: "bienLoiNhuanGop",
        Name: "bienLoiNhuanGop",
        Values: bienLoiNhuanGopValues
    })
    result.push({
        ID: "ROS",
        Name: "ROS",
        Values: ROSValues
    })
    result.push({
        ID: "ROA",
        Name: "ROA",
        Values: ROAValues
    })
    result.push({
        ID: "ROE",
        Name: "ROE",
        Values: ROEValues
    })
    result.push({
        ID: "heSoDonBayTaiChinh",
        Name: "heSoDonBayTaiChinh",
        Values: heSoDonBayTaiChinhValues
    })
    result.push({
        ID: "EPS",
        Name: "EPS",
        Values: EPSValues
    })

    // INDEX 5

    // INDEX 6
    result.push({
        ID: "PE",
        Name: "PE",
        Values: PEValues
    })
    result.push({
        ID: "PB",
        Name: "PB",
        Values: PBValues
    })
    return result
}

export const mapDataLatestFinancialReport = (data, period = null, type = null) => {
    // console.log(data);


    const cloneData = cloneDeep(data);
    
    return cloneData
}

export const getPreviousDate = (date) => {
    let count = -1
    if (moment(date).format('ddd') === 'Mon') {
        count = -3
    } else if (moment(date).format('ddd') === 'Sun') {
        count = -3
    } else if (moment(date).format('ddd') === 'Sat') {
        count = -2
    }
    return moment(date).add(count, 'days').format('YYYY-MM-DD') + 'T00:00:00Z'
}

export const getEndDate = (date) => {
    let count = 0
    if (moment(date).format('ddd') === 'Mon') {
        count = 0
    } else if (moment(date).format('ddd') === 'Sun') {
        count = -2
    } else if (moment(date).format('ddd') === 'Sat') {
        count = -1
    }
    return moment(date).add(count, 'days').format('YYYY-MM-DD') + 'T00:00:00Z'
}

export const getIndustryType = (symbol) => {
    let type = 'TYPE_DEFAULT';
    Object.keys(INDUSTRY_TYPE_LIST_STOCK).map(i => {
        if (INDUSTRY_TYPE_LIST_STOCK[i].includes(symbol)) {
            type = i;
            return;
        }
    })
    return type
}

export const getNote = (industryType, lastestFinancialReportsType) => {
    switch (lastestFinancialReportsType) {
        case LATEST_FINANCIAL_REPORTS.TYPE_1:
            if (industryType === 'TYPE_DEFAULT') {
                return [
                    {
                        index: 101,
                        title: 'A. Tài sản lưu động và đầu tư ngắn hạn',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 10102,
                        title: 'II. Các khoản đầu tư tài chính ngắn hạn',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 10103,
                        title: 'III. Các khoản phải thu ngắn hạn',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 10104,
                        title: 'IV. Tổng hàng tồn kho',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 302,
                        title: 'B. Nguồn vốn chủ sở hữu',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 3020114,
                        title: '14. Lợi ích của cổ đông không kiểm soát',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 3010101,
                        title: '1. Vay và nợ thuê tài chính ngắn hạn',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 3010206,
                        title: '6. Vay và nợ thuê tài chính dài hạn',
                        meaning: 'tang thi tot'
                    },
                    {
                        index: 501,
                        title: 'Ty le no vay / VCSH',
                        meaning: 'tang thi tot'
                    }
                ]
            } else {
                return []
            }
        case LATEST_FINANCIAL_REPORTS.TYPE_2:
            return []
        case LATEST_FINANCIAL_REPORTS.TYPE_3:
            return []
        case LATEST_FINANCIAL_REPORTS.TYPE_4:
            return []
        default:
            return []
    }
}

export const mapData = (data, source) => {
    const { companies, stocks, decisiveIndexes, latestFinancialInfo } = source;
    if (!source || !companies || !stocks || !decisiveIndexes || !latestFinancialInfo ) return data
    each(data, i => {
        i.ICBCode = Number((companies[i.Stock] || {}).ICBCode)
        i.Symbol = (stocks[i.Stock] || {}).Symbol
        i.LowestPoint = (decisiveIndexes[i.Stock] || {}).LowestPoint
        i.LowestPointChange = (i.PriceClose - (decisiveIndexes[i.Stock] || {}).LowestPoint) / (decisiveIndexes[i.Stock] || {}).LowestPoint * 100
        i.LastBuyPoint = (decisiveIndexes[i.Stock] || {}).LastBuyPoint
        i.SellPoint = (decisiveIndexes[i.Stock] || {}).SellPoint
        i.PercentSellPoint = Number(((1 - (i.PriceClose / 1000) / i.SellPoint) * 100).toFixed(1))
        i.PercentLastBuyPoint = Number(((1 - (i.PriceClose / 1000) / i.LastBuyPoint) * 100).toFixed(1))
        i.EPS = Number(Number((latestFinancialInfo[i.Stock] || {}).EPS).toFixed(0))
        i.PE = Number(Number((latestFinancialInfo[i.Stock] || {}).PE).toFixed(0))
        i.PS = Number(Number((latestFinancialInfo[i.Stock] || {}).PS).toFixed(0))
        i.PB = Number(Number((latestFinancialInfo[i.Stock] || {}).PB).toFixed(0))
        i.ROA = Number((Number((latestFinancialInfo[i.Stock] || {}).ROA) * 100).toFixed(0))
        i.ROE = Number((Number((latestFinancialInfo[i.Stock] || {}).ROE) * 100).toFixed(0))
        i.DividendInCash_03YrAvg = Number(Number((latestFinancialInfo[i.Stock] || {}).DividendInCash_03YrAvg).toFixed(0))
        i.DividendInShares_03YrAvg = Number((Number((latestFinancialInfo[i.Stock] || {}).DividendInShares_03YrAvg) * 100).toFixed(1))
        i.PriceChange = Number(((i.PriceClose - i.PreviousClose) * 100 /i.PreviousClose).toFixed(1))
        i.PriceClose = Number((i.PriceClose / 1000).toFixed(1))
        i.FreeShares = Number(Number((latestFinancialInfo[i.Stock] || {}).FreeShares).toFixed(0))
        i.VolumeChange = Number(((i.DealVolume - i.PreviousVolume) * 100 /i.PreviousVolume).toFixed(1))
        i.MarketCap = Number(Number((latestFinancialInfo[i.Stock] || {}).MarketCapitalization).toFixed(0))
        return i
    })
    // console.log(data)
    return data
}

export const getData = (data: any = {}) => {
    const { endData, startData } = data;
    if (!data || !endData || !startData) return [];
    endData.map(i => {
        i.PreviousClose = (startData.filter(j => j.Stock === i.Stock)[0] || {}).PriceClose
        i.PreviousVolume = (startData.filter(j => j.Stock === i.Stock)[0] || {}).DealVolume
        return i
    })
    // console.log(endData)
    return endData
}