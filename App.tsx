import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import { usePosts } from "./src/hooks/usePosts";

const App = () => {
  const { posts, fetchPostDetails, selectedPost, publishPost, updatePost } =
    usePosts();
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handlePublish = async () => {
    if (newTitle.trim() === "" || newBody.trim() === "") {
      Alert.alert("Erro", "Título e corpo não podem estar vazios.");
      return;
    }

    if (selectedId !== null) {
      const updatedPost = {
        userId: 1,
        id: selectedId,
        title: newTitle,
        body: newBody,
      };

      await updatePost(updatedPost);
      Alert.alert("Sucesso", "Post atualizado com sucesso!");
    } else {
      const newPost = {
        userId: 1,
        title: newTitle,
        body: newBody,
      };

      await publishPost(newPost);
      Alert.alert("Sucesso", "Novo post adicionado com sucesso!");
    }

    setNewTitle("");
    setNewBody("");
    setSelectedId(null);
  };

  const handleEdit = (postId: number, title: string, body: string) => {
    setSelectedId(postId);
    setNewTitle(title);
    setNewBody(body);
  };

  const handlePostClick = async (postId: number) => {
    await fetchPostDetails(postId);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedId !== null ? "Editar Post" : "Criar Novo Post"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Corpo"
        value={newBody}
        onChangeText={setNewBody}
        multiline
      />
      <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishButtonText}>
          {selectedId !== null ? "Atualizar" : "Publicar"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <TouchableOpacity
              style={styles.postButton}
              onPress={() => handlePostClick(item.id)}
            >
              <View style={styles.divpost}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postBody}>{item.body}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item.id, item.title, item.body)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedPost && (
            <ScrollView style={styles.scrollView}>
              <Text style={styles.detailsTitle}>{selectedPost.title}</Text>
              <Text style={styles.detailsBody}>{selectedPost.body}</Text>
              <Text style={styles.detailsComments}>Comentários:</Text>
              {selectedPost.comments.map((comment) => (
                <Text key={comment.id} style={styles.comment}>
                  {comment.body}
                </Text>
              ))}
            </ScrollView>
          )}
          <Button title="Fechar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    marginTop: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
  },
  publishButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  publishButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  postItem: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 7,
  },
  postBody: {
    fontSize: 10,
    color: "#666",
    textAlign: "justify",
  },
  editButton: {
    padding: 5,
    marginLeft: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divpost: {
    padding: 2,
    width: "85%",
  },
  postButton: {
    width: "80%",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  scrollView: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 70,
    fontWeight: "bold",
  },
  detailsBody: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailsComments: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  comment: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
});

export default App;
