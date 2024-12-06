function ListItem({ index, image, name }) {
    return (
      <div className="flex items-center gap-4">
        <span className="font-bold p-1 text-xl">{index}</span>
        <img
          src={image}
          alt="Item"
          className="w-12 h-12 object-cover rounded"
        />
        <span className="text-lg font-semibold truncate overflow-hidden">
          {name}
        </span>
      </div>
    );
  }
  
  export default ListItem;
  