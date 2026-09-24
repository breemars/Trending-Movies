{/* Returns DaisyUI's Loading Spinner */}

const Spinner = () => {
  return (
    <div className="flex md:h-full h-[50vh] items-center justify-center">
        {/* Centered in the middle based on the available space */}
        <span className="loading loading-spinner loading-xl text-secondary" />
    </div>
  )
}

export default Spinner