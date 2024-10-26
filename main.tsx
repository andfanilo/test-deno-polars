import pl from "nodejs-polars";
import { Hono } from "hono";
import type { FC } from "hono/jsx";

const df = pl.readCSV("./data/Superstore_2024.csv");

const Help: FC = () => {
  return (
    <div
      style={{
        marginTop: "4em",
        paddingLeft: "8em",
        paddingRight: "8em",
      }}
    >
      <p style={{ fontSize: "2.5rem", fontWeight: "700", color: "#174C4F" }}>
        Superstore Hono API 📑
      </p>
      <p>Here are the available endpoints</p>
      <ul>
        <li>/orders: get all order IDs</li>
        <li>/orders/&#123;id&#125;: get order profit from ID</li>
        <li>/customers: get all customer IDs</li>
        <li>/customers/&#123;id&#125;: get customer name from ID</li>
      </ul>
    </div>
  );
};

const getOrders = () => {
  return df.getColumn("Order ID").toArray();
};
const getOrderById = (orderId: string) => {
  console.log(`Filtering order on: ${orderId}`);
  return df
    .filter(pl.col("Order ID").eq(pl.lit(orderId)))
    .getColumn("Profit")
    .get(0);
};

const getCustomers = () => {
  return df.getColumn("Customer ID").toArray();
};
const getCustomerById = (customerId: string) => {
  console.log(`Filtering customer on: ${customerId}`);
  return df
    .filter(pl.col("Customer ID").eq(pl.lit(customerId)))
    .getColumn("Customer Name")
    .unique()
    .get(0);
};

const app = new Hono();

app.get("/", (c) => c.html(<Help />));

app.get("/orders", (c) => c.json({ data: getOrders() }));
app.get("/orders/:oid", (c) => {
  const orderId = c.req.param("oid");
  return c.json({ data: getOrderById(orderId) });
});

app.get("/customers", (c) => c.json({ data: getCustomers() }));
app.get("/customers/:cid", (c) => {
  const customerId = c.req.param("cid");
  return c.json({ data: getCustomerById(customerId) });
});

Deno.serve(app.fetch);
