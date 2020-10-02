import { cloneDeep } from 'lodash';
import moment from 'moment';


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
    let result = {}
    data.forEach(item => {
        result[item.id] = item
    })
    return result
}

export function mapDataTwoDate(data1, data2, allStocks) {
    if (!data1 || !data2 || !allStocks) return []
    let data1Obj = {};
    let data2Obj = {};
    data1.forEach(item => {
        data1Obj[item.Stock] = item
    })
    data2.forEach(item => {
        data2Obj[item.Stock] = item
    })
    // console.log(allStocks, data1, data2, data1Obj, data2Obj)
    for (let i = 0; i < data1.length; i++) {
        data1[i].TodayCapital = Number((data1[i].PriceClose * data1[i].DealVolume / 1000000000).toFixed(0))
        data1[i].MarketCap = Number((data1[i].MarketCap / 1000000000).toFixed(0))
        if (!data2Obj[data1[i].Stock]) {

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
    let result = []

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
    let tyLeThanhToanHienHanhValues = [];
    let tyLeThanhToanNhanhValues = [];
    let tyLeThanhToanTucThoiValues = [];
    let khaNangThanhToanLaiVayValues = [];
    // INDEX 2
    let tyLeNoVay_VCSHValues = []
    let tyLeNovayDaiHan_VCSHValues = []
    let tyLeNoVayNganHan_VCSHValues = []
    // INDEX 3
    let soVongQuayHangTonKhoValues = []
    let soVongQuayPhaiThuKhachHangValues = []
    let soVongQuayPhaiTraNguoiBanValues = []
    let vongQuayTienMatValues = []
    let vongQuayTaiSanValues = []
    // INDEX 4
    let bienLoiNhuanGopValues = []
    let ROSValues = []
    let ROAValues = []
    let ROEValues = []
    let heSoDonBayTaiChinhValues = []
    let EPSValues = []
    // INDEX 5
    // let tyLeChiTraCoTucValues = []
    // let tySuatCoTucValues = []
    // INDEX 6
    let PEValues = []
    let PBValues = []

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

        let dataType3Indexes = dataType3.filter(j => Number(j.Year) === i)

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
        let soVongQuayPhaiTraNguoiBan = (tongCongNguonVonValue && (phaiTraNguoiBanNganHanValue || phaiTraNguoiBanNganHanValue === 0) && (phaiTraNguoiBanDaiHanValue || phaiTraNguoiBanDaiHanValue === 0)) ? tongCongNguonVonValue / (phaiTraNguoiBanNganHanValue + phaiTraNguoiBanDaiHanValue) : null
        let vongQuayTienMat = (
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
    console.log(result)
    return result
}

export const mapDataLatestFinancialReport = (data, period = null, type = null) => {
    let cloneData = cloneDeep(data);
    let tongDoanhThuValues = []
    let tongChiPhiValues = []

    if (type === LATEST_FINANCIAL_REPORTS.TYPE_2) {
        if (cloneData.length) {


            cloneData[0].Values.forEach(i => {
                let doanhThuThuan = cloneData.filter(j => j.ID === 3)[0].Values.filter(j => j.Year === i.Year)[0].Value
                let doanhThuHoatDongTaiChinh = cloneData.filter(j => j.ID === 6)[0].Values.filter(j => j.Year === i.Year)[0].Value
                let doanhThuKhac = cloneData.filter(j => j.ID === 12)[0].Values.filter(j => j.Year === i.Year)[0].Value

                let giaVonBanHang = cloneData.filter(j => j.ID === 4)[0].Values.filter(j => j.Year === i.Year)[0].Value
                let chiPhiTaiChinh = cloneData.filter(j => j.ID === 7)[0].Values.filter(j => j.Year === i.Year)[0].Value
                let chiPhiBanHang = cloneData.filter(j => j.ID === 9)[0].Values.filter(j => j.Year === i.Year)[0].Value
                let chiPhiKhac = cloneData.filter(j => j.ID === 13)[0].Values.filter(j => j.Year === i.Year)[0].Value

                tongDoanhThuValues.push({
                    Year: i.Year,
                    Value: doanhThuThuan + doanhThuHoatDongTaiChinh + doanhThuKhac
                })

                tongChiPhiValues.push({
                    Year: i.Year,
                    Value: giaVonBanHang + chiPhiTaiChinh + chiPhiBanHang + chiPhiKhac
                })
            })
            cloneData.push({
                ID: 'TONG DOANH THU',
                Name: 'TONG DOANH THU (3)+(6)+(12)',
                Values: tongDoanhThuValues
            })


            cloneData.push({
                ID: 'TONG CHI PHI',
                Name: 'TONG CHI PHI (4)+(7)+(9)+(13)',
                Values: tongChiPhiValues
            })
        }
    }

    for (let i = 0; i < cloneData.length; i++) {
        let id = JSON.stringify(cloneData[i].ID)
        if (id.match(/^1/) || id.match(/^2/)) {
            cloneData[i].ParentID1 = 1
            if (id.match(/^10/)) {
                cloneData[i].ParentID2 = 10
                if (id.match(/^101/)) {
                    cloneData[i].ParentID3 = 101
                    if (id.match(/^10101/)) {
                        cloneData[i].ParentID4 = 10101
                    } else if (id.match(/^10102/)) {
                        cloneData[i].ParentID4 = 10102
                    } else if (id.match(/^10103/)) {
                        cloneData[i].ParentID4 = 10103
                    } else if (id.match(/^10104/)) {
                        cloneData[i].ParentID4 = 10104
                    } else if (id.match(/^10105/)) {
                        cloneData[i].ParentID4 = 10105
                    } else if (id.match(/^10106/)) {
                        cloneData[i].ParentID4 = 10106
                    } else if (id.match(/^10107/)) {
                        cloneData[i].ParentID4 = 10107
                    }
                } else if (id.match(/^102/)) {
                    cloneData[i].ParentID3 = 102
                    if (id.match(/^10201/)) {
                        cloneData[i].ParentID4 = 10201
                    } else if (id.match(/^10202/)) {
                        cloneData[i].ParentID4 = 10202
                    } else if (id.match(/^10203/)) {
                        cloneData[i].ParentID4 = 10203
                    } else if (id.match(/^10204/)) {
                        cloneData[i].ParentID4 = 10204
                    } else if (id.match(/^10205/)) {
                        cloneData[i].ParentID4 = 10205
                    } else if (id.match(/^10206/)) {
                        cloneData[i].ParentID4 = 10206
                    } else if (id.match(/^10207/)) {
                        cloneData[i].ParentID4 = 10207
                    }
                }
            }
        } else if (id.match(/^3/) || id.match(/^4/)) {
            cloneData[i].ParentID1 = 3
            if (id.match(/^30/)) {
                cloneData[i].ParentID2 = 30
                if (id.match(/^301/)) {
                    cloneData[i].ParentID3 = 301
                    if (id.match(/^30101/)) {
                        cloneData[i].ParentID4 = 30101
                    } else if (id.match(/^30102/)) {
                        cloneData[i].ParentID4 = 30102
                    } else if (id.match(/^30103/)) {
                        cloneData[i].ParentID4 = 30103
                    } else if (id.match(/^30104/)) {
                        cloneData[i].ParentID4 = 30104
                    } else if (id.match(/^30105/)) {
                        cloneData[i].ParentID4 = 30105
                    } else if (id.match(/^30106/)) {
                        cloneData[i].ParentID4 = 30106
                    } else if (id.match(/^30107/)) {
                        cloneData[i].ParentID4 = 30107
                    }
                } else if (id.match(/^302/)) {
                    cloneData[i].ParentID3 = 302
                    if (id.match(/^30201/)) {
                        cloneData[i].ParentID4 = 30201
                    } else if (id.match(/^30202/)) {
                        cloneData[i].ParentID4 = 30202
                    } else if (id.match(/^30203/)) {
                        cloneData[i].ParentID4 = 30203
                    } else if (id.match(/^30204/)) {
                        cloneData[i].ParentID4 = 30204
                    } else if (id.match(/^30205/)) {
                        cloneData[i].ParentID4 = 30205
                    } else if (id.match(/^30206/)) {
                        cloneData[i].ParentID4 = 30206
                    } else if (id.match(/^30207/)) {
                        cloneData[i].ParentID4 = 30207
                    }
                } else {
                    cloneData[i].ParentID3 = 13
                }
            }
        } else {
            cloneData[i].ParentID1 = 3
        }

        if (type === LATEST_FINANCIAL_REPORTS.TYPE_1) {
            let yearArray = [2015, 2016, 2017, 2018, 2019]
            let tongCongTaiSan = data.filter(i => i.ID === 2)[0].Values

            yearArray.forEach((year, index) => {
                cloneData[i].Values.push(
                    {
                        Year: `%${yearArray[index]}`,
                        Value: cloneData[i].Values.filter(j => j.Year === year)[0].Value / tongCongTaiSan.filter(j => j.Year === year)[0].Value
                    }
                )
                if (index > 0) {
                    let newValue = cloneData[i].Values.filter(j => j.Year === year)[0].Value
                    let oldValue = cloneData[i].Values.filter(j => j.Year === yearArray[index - 1])[0].Value
                    cloneData[i].Values.push(
                        {
                            Year: `${year}-${yearArray[index - 1]}`,
                            Value: (newValue - oldValue) / oldValue
                        }
                    )
                }
            })
        } else if (type === LATEST_FINANCIAL_REPORTS.TYPE_2) {
            let yearArray = [2015, 2016, 2017, 2018, 2019]

            yearArray.forEach((year, index) => {
                console.log(cloneData[i])
                if ([3, 6, 12].includes(cloneData[i].ID)) {
                    cloneData[i].Values.push(
                        {
                            Year: `%${yearArray[index]}`,
                            Value: (cloneData[i].Values.filter(j => j.Year === year)[0] || {}).Value / (tongDoanhThuValues.filter(j => j.Year === year)[0] || {}).Value
                        }
                    )
                } else if ([4, 7, 9, 13].includes(cloneData[i].ID)) {
                    cloneData[i].Values.push(
                        {
                            Year: `%${yearArray[index]}`,
                            Value: (cloneData[i].Values.filter(j => j.Year === year)[0] || {}).Value / (tongChiPhiValues.filter(j => j.Year === year)[0] || {}).Value
                        }
                    )
                }

                if (index > 0) {
                    let newValue = (cloneData[i].Values.filter(j => j.Year === year)[0] || {}).Value
                    let oldValue = (cloneData[i].Values.filter(j => j.Year === yearArray[index - 1])[0] || {}).Value
                    cloneData[i].Values.push(
                        {
                            Year: `${year}-${yearArray[index - 1]}`,
                            Value: (newValue - oldValue) / oldValue
                        }
                    )
                }

            })
        }

        if (type === LATEST_FINANCIAL_REPORTS.TYPE_2) {
            switch (cloneData[i].ID) {
                case 'TONG DOANH THU':
                    cloneData[i].sortedIndex = 0
                    break;
                case 3:
                    cloneData[i].sortedIndex = 1
                    break;
                case 6:
                    cloneData[i].sortedIndex = 2
                    break;
                case 12:
                    cloneData[i].sortedIndex = 3
                    break;
                case 'TONG CHI PHI':
                    cloneData[i].sortedIndex = 4
                    break;
                case 4:
                    cloneData[i].sortedIndex = 5
                    break;
                case 7:
                    cloneData[i].sortedIndex = 6
                    break;
                case 9:
                    cloneData[i].sortedIndex = 7
                    break;
                case 13:
                    cloneData[i].sortedIndex = 8
                    break;
                case 5:
                    cloneData[i].sortedIndex = 9
                    break;
                case 15:
                    cloneData[i].sortedIndex = 10
                    break;
                case 18:
                    cloneData[i].sortedIndex = 11
                    break;
                case 19:
                    cloneData[i].sortedIndex = 12
                    break;
                default:
                    cloneData[i].sortedIndex = 9999
                    break;
            }
        }

    }
    if (type === LATEST_FINANCIAL_REPORTS.TYPE_2) {
        cloneData.sort((a, b) => a.sortedIndex - b.sortedIndex)
    }
    console.log(cloneData)
    return cloneData
}

export const getPreviousDate = (date) => {
    let count = -1
    if (moment(date).format('ddd') === 'Mon') {
        count = -3
    } else if (moment(date).format('ddd') === 'Sun') {
        count = -2
    }
    return moment(date).add(count, 'days').format('YYYY-MM-DD') + 'T00:00:00Z'
}