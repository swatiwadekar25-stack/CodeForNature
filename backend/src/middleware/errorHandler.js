export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

export function errorHandler(error, request, response, next) {
  console.error(error);

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.fromEntries(
        Object.entries(error.errors).map(([field, fieldError]) => [field, fieldError.message]),
      ),
    });
  }

  if (error.name === 'CastError') {
    return response.status(400).json({
      success: false,
      message: 'Invalid resource identifier',
    });
  }

  if (
    error.name === 'MongoServerError'
    || error.name === 'MongoNetworkError'
    || error.name === 'MongoServerSelectionError'
    || error.name === 'MongooseError'
  ) {
    return response.status(503).json({
      success: false,
      message: 'Database operation failed',
    });
  }

  if (error instanceof RangeError || error instanceof TypeError) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return response.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
}