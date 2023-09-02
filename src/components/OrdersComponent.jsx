import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllOrders, getUserOrders, submitOrderById } from "./api/CarApiService";
import { useAuth } from "./security/AuthContext";

export default function OrdersComponent() {
  const params = useParams();
  const [ordersList, serOrdersList] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    if (params.userId) {
      if (auth.isAdmin) {
        getAllOrders().then(resp => serOrdersList(resp.data)).catch(err => console.log(err));
      } else {
        getUserOrders(params.userId).then(resp => serOrdersList(resp.data)).catch(err => console.log(err));
      }
    }
  }, [params.userId, auth.isAdmin]);


  const submitOrder = e => {
    const orderId = e.target.getAttribute('data-order-id');
    submitOrderById(orderId).then(resp => window.location.reload())
    
  }


  return (
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
            <th>Order status</th>
            <th>Order submission</th>
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
              {auth.isAdmin && <td>{item.orderState}</td>}
              {auth.isAdmin && <button type="button" data-order-id={item.orderId} onClick={submitOrder} class="btn btn-success">Submit</button>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}