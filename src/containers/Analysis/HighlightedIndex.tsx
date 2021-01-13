import React from 'react';
import { connect } from 'react-redux';

  
interface IProps {
 
}

interface IState {

}


class HighlightedIndex extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    async componentDidMount() {
      
    }

    render() {
        return (
            <div className="flex">
                HighlightedIndex: 
                <div>
                    Bao cao luu chuyen tien te
                    <div>
                        Hoat dong kinh doanh
                        <div>HBC</div>
                        <div>{`Hoat dong kinh doanh: -182 ty ==> -706 ty: am them 504 ty`}</div>
                        <div>{`Tang khoan phai thu: -1983 ty ==> -667 ty: tang 1317 ty`}</div>
                        <div>{`Giam cac khoan phai tra: 1591 ty ==> -815 ty: giam 2407 ty`}</div>
                        <div>------</div>
                        <div>VCS</div>
                        <div>{`HDKD: tang 564 ty`}</div>
                        <div>{`LNTT: tang 335 ty`}</div>
                        <div>{`Hang ton kho: tang 554 ty`}</div>
                        <div>{`Khoan phai thu: tang 265 ty`}</div>

                    </div>
                    <div>------</div>
                    <div>
                        Hoat dong dau tu
                        <div>HBC</div>
                        <div>{`Hoat dong dau tu: 324 ty ==> - 164 ty: giam 489 ty`}</div>
                        <div>{`Note: thuong hoat dong dau tu am k sao. Nhung neu hoat dong kinh doanh am va hoat dong dau tu am thi co van de`}</div>
                        <div>VCS</div>
                        <div>giam 13 ty</div>
                    </div>
                    <div>------</div>
                    <div>
                        Hoat dong tai chinh
                        <div>HBC</div>
                        <div>{`Hoat dong tai chinh: -322 ty ==> 1130 ty: tang 1453 ty`}</div>
                        <div>Doanh nghiep tang vay no de day hoat dong san xuat kinh doanh</div>
                        <div>VCS</div>
                        <div>{`Am them 308 ty: mang di tra no hoac tra co tuc ==> tot`}</div>
                    </div>
                    <div>------</div>
                    <div>
                        Chu y:
                        <div>Tien chay ra khoi doanh nghiep nhu nao? Lau chua? (5 nam)</div>
                    </div>                    
                </div>
                <div>
                    Can doi ke toan
                    <div>HBC</div>
                    <div>No vay tai chinh ngan han: 4742 ty</div>
                    <div>No vay tai chinh dai han: 219 ty</div>
                    <div>Tong vay: 4961 ty</div>
                    <div>VCSH: 3959 ty</div>
                    <div>Ty le no/VCSH: 1.25</div>
                    <div>{`Tong no vay so vs nam ngoai: 4961/4341 ==> tang 15%`}</div>
                    <div>VCS</div>
                    <div>No vay tai chinh ngan han: 1417 ty</div>
                    <div>No vay tai chinh dai han: 253 ty</div>
                    <div>Tong vay: 1670 ty</div>
                    <div>VCSH: 3448 ty</div>
                    <div>{`No vay/ VCSH: 0.49 ==> an toan `}</div>
                    <div>{`Tong no vay so vs nam ngoai: 1670/1150 ==> tang 45%: hop ly vi doanh thu tang 22%`}</div>
                    <div>------</div>
                    <div>
                        Note
                        <div>No vay tai chinh: dung ngay phai tra ngan hang, no vay doi tac thi co the thu xep sau duoc</div>
                    </div>
                </div>
                <div>
                    KQKD
                    <div>HBC</div>
                    <div>Doanh thu tang</div>
                    <div>LN gop, LNST giam: LN chat luong kem, tien k ve trong 3 nam</div>
                    <div>VCS</div>
                    <div>Doanh thu tang 23%</div>
                    <div>LN gop tang 28%</div>
                </div>
            </div>
        )
    }
}

export default connect(null, null)(HighlightedIndex);
