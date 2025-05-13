import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Commande = () => {
  const [bons, setBons] = useState([]);

  // Récupérer les données depuis l'API
  useEffect(() => {
    axios.get('http://localhost:8081/bonachats/en-attente')
      .then(response => {
        setBons(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des bons :', error);
      });
  }, []);

  // Fonction pour générer un PDF
  const generatePDF = (bon) => {
    const doc = new jsPDF();

    // Informations de la société
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Société ERRAAD AND FADDANI Inventory IA', 14, 20);
    doc.setFontSize(12);
    doc.text('Adresse: Les orangers Oulfa Casa', 14, 30);
    doc.text('Téléphone: 05 22 00 00 00', 14, 40);
    doc.text('Email: contact@societe.com', 14, 50);

    // Section Bon d'achat
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('Bon d\'Achat', 14, 70);
    doc.setFontSize(12);
    doc.text(`Produit: ${bon.nomProduit}`, 14, 80);
    doc.text(`Catégorie: ${bon.categorie}`, 14, 90);
    doc.text(`Description: ${bon.description}`, 14, 100);
    doc.text(`Quantité: ${bon.quantite}`, 14, 110);
    doc.text(`Prix Unitaire: ${bon.prixUnitaire} MAD`, 14, 120);
    doc.text(`Emplacement: ${bon.emplacement}`, 14, 130);
    doc.text(`Statut: ${bon.statut}`, 14, 140);
    doc.text(`Date de Création: ${bon.dateCreation}`, 14, 150);

    // Section Fournisseur
    doc.setFontSize(16);
    doc.text('Fournisseur', 14, 220);
    doc.setFontSize(12);
    doc.text(`Nom: ${bon.nomFournisseur}`, 14, 230);
    doc.text(`Adresse: ${bon.adresseFournisseur}`, 14, 240);
    doc.text(`Email: ${bon.emailFournisseur}`, 14, 250);
    doc.text(`Téléphone: ${bon.telephoneFournisseur}`, 14, 260);

    // Changer la couleur du statut dans le PDF
    if (bon.statut === 'Approuvé') {
      doc.setTextColor(0, 128, 0);  // Vert pour "Approuvé"
    } else {
      doc.setTextColor(255, 165, 0);  // Orange pour "En attente"
    }
    doc.text(`Statut: ${bon.statut}`, 14, 270);

    // Sauvegarder le PDF
    doc.save(`Bon_d_Achat_${bon.id}.pdf`);
  };

  // Fonction pour approuver un bon d'achat
  const approuverBonAchat = (id) => {
    axios.put(`http://localhost:8081/bonachats/approuver/${id}`)
      .then(response => {
        // alert('Bon d\'achat approuvé!');
        // Mettre à jour l'état des bons pour refléter le changement
        setBons(bons.map(bon => bon.id === id ? { ...bon, statut: 'Approuvé' } : bon));
      })
      .catch(error => {
        console.error('Erreur lors de l\'approbation du bon :', error);
        alert('Erreur lors de l\'approbation du bon.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📦 Bons d'Achat en Attente</h2>
      {bons.length === 0 ? (
        <p>Aucun bon d'achat en attente.</p>
      ) : (
        <>
          {/* Tableau des Bons d'Achat */}
          <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Statut</th>
                <th>Fournisseur</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bons.map((bon) => (
                <tr key={bon.id}>
                  <td>{bon.nomProduit}</td>
                  <td>{bon.categorie}</td>
                  <td>{bon.quantite}</td>
                  <td>{bon.prixUnitaire} MAD</td>
                  <td style={{ color: bon.statut === 'Approuvé' ? 'green' : 'orange' }}>
                    {bon.statut}
                  </td>
                  <td>{bon.nomFournisseur}</td>
                  <td>{bon.dateCreation}</td>
                  <td>
                    <button
                      onClick={() => generatePDF(bon)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#22A085',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                      }}
                    >
                      Générer PDF
                    </button>
                    {bon.statut === 'En attente' && (
                      <button
                        onClick={() => approuverBonAchat(bon.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#FF8C00',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          marginLeft: '10px',
                        }}
                      >
                        Approuver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Commande;
