class Product {
  final int id;
  final String name;

  Product({required this.id, required this.name});

  factory Product.fromJson(Map<String, dynamic> json) {
    int productId = 0;

    // Handle id conversion from various types
    if (json['id'] != null) {
      if (json['id'] is int) {
        productId = json['id'] as int;
      } else if (json['id'] is String) {
        productId = int.tryParse(json['id'] as String) ?? 0;
      } else if (json['id'] is double) {
        productId = (json['id'] as double).toInt();
      }
    }

    return Product(id: productId, name: (json['name'] ?? 'Unknown') as String);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
