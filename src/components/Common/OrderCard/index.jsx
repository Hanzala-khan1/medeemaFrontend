import React from "react";
import styles from "./orderCard.module.css";
import classNames from "classnames";
import dummy from "../../../../public/images/dummy.png";
import Image from "next/image";

const OrderCard = (props) => {
  const { data } = props;
  console.log(data)
  return (
    <div className={styles.bgcolor}>
      <div className={styles.card}>
        <Image src={dummy} className={styles.nurseimg} alt="dummy" />
        <div className={classNames(styles.flx, styles.mt20)}>
          <p className={styles.text}>{data.requested_user_id? data.requested_user_id?.full_name: data.requested_rehab_id?.Name}</p>
          <button className={styles.btn}>{data.rate_type}</button>
        </div>
        <div className={styles.mt10}>
          <p className={styles.text2}>100{data?.amount}$</p>
        </div>
        <div className={styles.mt10}>
          <p className={styles.text2}>status: {data?.status}</p>
        </div>
        <div className={styles.mt10}>
          <p className={styles.text3}>Booking Duration</p>
        </div>
        <div className={classNames(styles.mt10, styles.bar)}>
          <p>{data?.from + " "}</p>
          <p className={styles.colorBlack}>To</p>
          <p>{" " + data?.to}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
