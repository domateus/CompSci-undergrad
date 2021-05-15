#include <cstdlib>
#include <iostream>
#include <string.h>

#define HASH_SIZE 100

using namespace std;

template <typename T> struct node {
  string key;
  T value;
  node<T> *next;
};

template <typename T> struct Hash { node<T> *list[HASH_SIZE]; };

unsigned int hashCode(string key) {
  unsigned long hash = 4242;
  unsigned int c;
  for (char i : key) {
    c = i;
    hash = ((hash << 5) + hash) + c;
  }

  return hash % HASH_SIZE;
}

unsigned int hashCode2(string key) {
  unsigned long hash = 4242;
  unsigned int c;
  for (char i : key) {
    c = i;
    hash = ((hash << 5) ^ hash) ^ c;
  }

  return hash % HASH_SIZE;
}

template <typename T> node<T> *createNode(string key, T value) {
  node<T> *node = (::node<T> *)malloc(sizeof(::node<T>));
  node->value = value;
  node->key = key;
  return node;
}

template <typename T> void insert(Hash<T> *hash, string key, T value) {
  unsigned int index = hashCode(key);
  node<T> *node = hash->list[index];
  if (node == NULL) {
    hash->list[index] = createNode(key, value);
  } else {
    while (node) {
      if (node->next == NULL) {
        node->next = createNode(key, value);
        break;
      }
      node = node->next;
    }
  }
};

template <typename T>
void insertDoubleHash(Hash<T> *hash, string key, T value) {
  unsigned int index1 = hashCode(key);
  unsigned int index2 = hashCode2(key);
  unsigned int index = index1 * index2;
  node<T> *node = hash->list[index];
  if (node == NULL) {
    hash->list[index] = createNode(key, value);
  } else {
    while (node) {
      if (node->next == NULL) {
        node->next = createNode(key, value);
        break;
      }
      node = node->next;
    }
  }
};

template <typename T> T search(Hash<T> *hash, string key) {
  unsigned int index = hashCode(key);
  node<T> *node = hash->list[index];
  while (node) {
    if (key.compare(node->key) == 0) {
      return node->value;
    }
    node = node->next;
  }
  return 0;
}

template <typename T> T search2(Hash<T> *hash, string key) {
  unsigned int index1 = hashCode(key);
  unsigned int index2 = hashCode2(key);
  unsigned int index = index1 * index2;
  node<T> *node = hash->list[index];
  while (node) {
    if (key.compare(node->key) == 0) {
      return node->value;
    }
    node = node->next;
  }
  return 0;
}
int main() {
  Hash<int> *hashTable = (Hash<int> *)malloc(sizeof(Hash<int>));
  insert(hashTable, "no", 1);
  insert(hashTable, "mateus", 42);

  insertDoubleHash(hashTable, "mais", 37);
  insertDoubleHash(hashTable, "colisoes", 64);

  cout << search(hashTable, "no") << endl;
  cout << search(hashTable, "mateus") << endl;
  cout << search2(hashTable, "mais") << endl;
  cout << search2(hashTable, "colisoes") << endl;
}
