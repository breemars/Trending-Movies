{/* Returns DaisyUI's Loading Spinner */}

const Spinner = () => {
  return (
    <div className="flex h-full items-center justify-center">
        {/* Centered in the middle based on the available space */}
        <span className="loading loading-spinner loading-xl text-secondary" />
    </div>
  )
}

export default Spinner