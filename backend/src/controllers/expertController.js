const Expert = require('../models/Expert');

// GET /api/experts?page=1&limit=10&category=Health&search=john
exports.getExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [experts, total] = await Promise.all([
      Expert.find(query)
        .select('-availableSlots')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Expert.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: experts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + experts.length < total,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/experts/:id
exports.getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }
    res.json({ success: true, data: expert });
  } catch (err) {
    next(err);
  }
};
