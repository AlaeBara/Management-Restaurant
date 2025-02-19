import React, { useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    { id: 1, customerName: 'John Doe', date: '2025-02-18', totalAmount: 150, status: 'pending' },
    { id: 2, customerName: 'Jane Smith', date: '2025-02-17', totalAmount: 200, status: 'completed' },
    { id: 3, customerName: 'Alice Brown', date: '2025-02-16', totalAmount: 100, status: 'canceled' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const viewOrderDetails = (id) => {
    const order = orders.find((order) => order.id === id);
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="header flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Commandes</h1>
          <p className="text-sm text-gray-600">Consultez et gérez toutes les commandes de votre restaurant.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters flex items-center gap-4 p-4 bg-white shadow-sm">
        <select className="border rounded px-4 py-2">
          <option value="">Tous les Statuts</option>
          <option value="pending">En Attente</option>
          <option value="completed">Complété</option>
          <option value="canceled">Annulé</option>
        </select>
        <input
          type="text"
          placeholder="Rechercher par ID ou Client"
          className="border rounded px-4 py-2 flex-1"
        />
      </div>

      {/* Orders Table */}
      <table className="w-full border-collapse bg-white shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID Commande</th>
            <th className="border px-4 py-2">Client</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Montant Total</th>
            <th className="border px-4 py-2">Statut</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.customerName}</td>
              <td className="border px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{order.totalAmount} Dh</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status === 'pending'
                    ? 'En Attente'
                    : order.status === 'completed'
                    ? 'Complété'
                    : 'Annulé'}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => viewOrderDetails(order.id)}
                  className="text-blue-500 hover:underline"
                >
                  Voir Détails
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination flex justify-between items-center p-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>Page {currentPage} sur {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>

      {/* Order Details Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold">Détails de la Commande</h2>
            <p>ID: {selectedOrder.id}</p>
            <p>Client: {selectedOrder.customerName}</p>
            <p>Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p>Montant Total: {selectedOrder.totalAmount} Dh</p>
            <p>Statut: {selectedOrder.status}</p>
            <button
              onClick={() => setIsModalVisible(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;