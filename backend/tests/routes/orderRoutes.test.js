const request = require('supertest');
const express = require('express');
const orderRoutes = require('../../routes/orderRoutes');
const orderController = require('../../controllers/orderController');
jest.mock('../../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../../middleware/adminMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../../controllers/orderController');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order Routes', () => {
  beforeEach(() => {
	jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
	it('should create a new order', async () => {
	  orderController.createOrder.mockImplementation((req, res) => res.status(201).json({ message: 'Order created successfully' }));
	  const response = await request(app).post('/api/orders').send({ orderItems: [], totalPrice: 100 });
	  expect(response.statusCode).toBe(201);
	  expect(response.body.message).toBe('Order created successfully');
	});
  });

  describe('GET /api/orders', () => {
	it('should fetch orders', async () => {
	  orderController.getOrders.mockImplementation((req, res) => res.status(200).json([{ id: '1', totalPrice: 100 }]));
	  const response = await request(app).get('/api/orders');
	  expect(response.statusCode).toBe(200);
	  expect(response.body).toEqual([{ id: '1', totalPrice: 100 }]);
	});
  });

  describe('PUT /api/orders/:id', () => {
	it('should update an order', async () => {
	  orderController.updateOrder.mockImplementation((req, res) => res.status(200).json({ message: 'Order updated successfully' }));
	  const response = await request(app).put('/api/orders/1').send({ totalPrice: 150 });
	  expect(response.statusCode).toBe(200);
	  expect(response.body.message).toBe('Order updated successfully');
	});
  });

  describe('DELETE /api/orders/:id', () => {
	it('should delete an order', async () => {
	  orderController.deleteOrder.mockImplementation((req, res) => res.status(200).json({ message: 'Order deleted successfully' }));
	  const response = await request(app).delete('/api/orders/1');
	  expect(response.statusCode).toBe(200);
	  expect(response.body.message).toBe('Order deleted successfully');
	});
  });
});