'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { client } from '@/sanity/lib/client';
import {
  PDFDownloadLink,
  Page,
  Document,
  StyleSheet,
  View,
  Image,
  Text,
} from '@react-pdf/renderer';
import { toPng } from 'html-to-image';

type Product = {
  _id: string;
  name: string;
  itemNumber: string;
  slug: { current: string };
};

type QRImage = {
  id: string;
  dataUrl: string;
  name: string;
  itemNumber: string;
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'flex-start',
  },
  qrBox: {
    width: 180,
    height: 220,
    margin: 10,
    padding: 5,
    border: '1 solid #ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 156,
    height: 156,
  },
  text: {
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 1.2,
    maxWidth: 156,
  },
});

// PDF Component
function QRPDF({ images }: { images: QRImage[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {images.map((img) => (
          <View key={img.id} style={styles.qrBox}>
            <Image src={img.dataUrl} style={styles.qrImage} />
            <View style={{ marginTop: 6 }}>
              <Text style={styles.text}>{img.name}</Text>
              <Text style={styles.text}>Item # {img.itemNumber}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export default function QRCodePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [qrImages, setQrImages] = useState<QRImage[]>([]);
  const qrRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    client
      .fetch<Product[]>(`*[_type == "product"]{_id, name, itemNumber, slug}`)
      .then((data) => {
        setProducts(data);
      });
  }, []);

  const generateImages = async () => {
    const images: QRImage[] = [];

    for (const p of products) {
      const node = qrRefs.current[p._id];
      if (!node) continue;

      const dataUrl = await toPng(node, { cacheBust: true });
      images.push({
        id: p._id,
        dataUrl,
        name: p.name,
        itemNumber: p.itemNumber,
      });
    }

    setQrImages(images);
  };

  return (
    <div className="relative min-h-screen bg-white p-6">
      <h1 className="uppercase text-xl font-semibold mb-6">
        Fireworks QR Codes
      </h1>

      <button
        onClick={generateImages}
        className="mb-4 bg-flag-blue text-white py-2 px-4 uppercase text-sm"
      >
        Prepare PDF
      </button>

      {qrImages.length > 0 && (
        <PDFDownloadLink
          document={<QRPDF images={qrImages} />}
          fileName="fireworks_qr_codes.pdf"
          className="mb-6 block bg-green text-white py-2 px-4 uppercase text-sm"
        >
          Download PDF
        </PDFDownloadLink>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '2rem',
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            ref={(el) => {
              qrRefs.current[product._id] = el;
            }}
            style={{
              width: 180,
              padding: 10,
              border: '1px solid #ccc',
              background: '#f9f9f9',
              textAlign: 'center',
            }}
          >
            <QRCodeCanvas
              value={product.slug.current}
              size={156}
              includeMargin={true}
            />
            {/* <div className="uppercase text-sm font-bold mt-2">
              {product.name}
            </div>
            <div className="uppercase text-xs">Item # {product.itemNumber}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
