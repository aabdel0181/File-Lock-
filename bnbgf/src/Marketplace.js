import penguin from './assets/penguin.jpeg';
import bayc from './assets/bayc.jpeg';
import cryptopunks from './assets/cryptopunk.jpeg';
import milady from './assets/milady.jpeg';


function Marketplace() {
  // In a real-world scenario, this data would come from an API call
  const collections = [
    {
      id: "1",
      title: "BAYC",
      nfts: [
        {
          id: "a1",
          title: "Ape #1",
          description: "Super cool bored ape",
          image: bayc,
          price: "$100",
        },
      ],
    },
    {
      id: "2",
      title: "Cryptopunks",
      nfts: [
        {
          id: "b1",
          title: "Punk #1",
          description: "Super cool punk",
          image: cryptopunks,
          price: "$100",
        },
      ],
    },
    {
      id: "3",
      title: "Milady",
      nfts: [
        {
          id: "c1",
          title: "Milady #1",
          description: "Super cool Milady",
          image: milady,
          price: "$550",
        }
      ],
    },
    {
      id: "4",
      title: "Pudgy Penguin",
      nfts: [
        {
          id: "d1",
          title: "Penguin #1",
          description: "Super cool penguin",
          image: penguin,
          price: "$70",
        }
      ],
    },
    // ... more collections
  ];


  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <h1 className="text-4xl font-bold mb-5">Marketplace</h1>
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="bg-white p-6 rounded-xl shadow-lg mb-6 relative"
        >
          <h2 className="text-3xl mb-4">{collection.title}</h2>

          <div className="overflow-x-auto">
            <div className="flex flex-row gap-2">
              {collection.nfts.map((nft) => (
                  <div>
                    <img
                      className="w-full max-h-60 object-cover mb-4"
                      src={nft.image}
                      alt={nft.title}
                    />
                    <div className="p-4">
                      <h3 className="text-xl">{nft.title}</h3>
                      <p>
                        {nft.description}
                      </p>
                      <span>
                        {nft.price}
                      </span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Marketplace;