import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserOrders } from "./api/CarApiService";

export default function OrdersComponent(){
    const params = useParams();
    const [ordersList, serOrdersList] = useState([]);


    useEffect(() => {
        if (params.userId) {
            getUserOrders(params.userId).then(resp => serOrdersList(resp.data)).catch(err => console.log(err));
        }
    }, [params.userId]);

    return(
    <div className="container mt-5">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Car Model</th>
            <th>Rent From</th>
            <th>Rent To</th>
            <th>Is Paid</th>
            <th>Payment Reference</th>
          </tr>
        </thead>
        <tbody>
          {ordersList.map(item => (
            <tr key={item.orderId}>
              <td>{item.orderId}</td>
              <td>{item.carModel}</td>
              <td>{item.rentFrom}</td>
              <td>{item.rentTo}</td>
              <td>{item.isPayed ? 'Yes' : 'No'}</td>
              <td><a href={item.paymentReference}>Pay</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}